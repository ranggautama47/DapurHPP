import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { resetPasswordTemplate } from '../email/templates/reset-password.template';
import { passwordChangedTemplate } from '../email/templates/password-changed.template';
import { welcomeTemplate } from '../email/templates/welcome.template';
import { verifyEmailTemplate } from '../email/templates/verify-email.template';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Email throttle window: 15 menit
  private readonly emailThrottleMs = 15 * 60 * 1000;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      namaBisnis: dto.namaBisnis,
    });

    // Generate email verification token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyTokenHash: tokenHash,
        emailVerifyExpiresAt: expiresAt,
      },
    });

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    // Kirim verify email (gagal kirim tidak menggagalkan register)
    try {
      const verifyLink = `${frontendUrl}/verify-email?token=${token}`;
      const html = verifyEmailTemplate(user.name, verifyLink, frontendUrl);
      await this.emailService.sendEmail(
        user.email,
        'Verifikasi Email DapurHPP',
        html,
      );
      this.logger.log(`Verify email terkirim ke ${user.email}`);
    } catch (error) {
      this.logger.error(`Gagal kirim verify email ke ${user.email}`, error);
    }

    const { password, ...result } = user;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email Anda belum diverifikasi. Silakan periksa inbox email Anda untuk memverifikasi akun.',
      );
    }

    // Update lastLoginAt (jangan throw kalau gagal)
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      this.logger.error(
        `Gagal update lastLoginAt untuk user ${user.id}`,
        error,
      );
    }

    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);

    const { password, ...result } = user;
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // User tidak ketemu — diam-diam skip, response tetap sama
    if (user) {
      // Email throttle: cek apakah token sebelumnya masih dalam window 15 menit
      if (user.passwordResetExpiresAt) {
        const tokenCreatedAt = new Date(
          user.passwordResetExpiresAt.getTime() - 60 * 60 * 1000,
        );
        const elapsedMs = Date.now() - tokenCreatedAt.getTime();
        if (elapsedMs < this.emailThrottleMs) {
          this.logger.log(
            `Email reset password di-throttle untuk ${user.email} (elapsed: ${Math.round(elapsedMs / 1000)}s)`,
          );
          // Response tetap generic — jangan bocorkan
          return {
            message: 'Jika email terdaftar, link reset password telah dikirim.',
          };
        }
      }

      try {
        // Generate token + hash
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

        // Simpan hash ke DB
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: expiresAt,
          },
        });

        // Kirim email berisi token ASLI (bukan hash)
        const frontendUrl =
          this.configService.getOrThrow<string>('FRONTEND_URL');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const html = resetPasswordTemplate(user.name, resetLink, frontendUrl);

        await this.emailService.sendEmail(
          user.email,
          'Reset Password DapurHPP',
          html,
        );

        this.logger.log(`Email reset password terkirim ke ${user.email}`);
      } catch (error) {
        // Email gagal — log tapi jangan bocorkan ke client
        this.logger.error(
          `Gagal kirim email reset password ke ${user.email}`,
          error,
        );
      }
    }

    return {
      message: 'Jika email terdaftar, link reset password telah dikirim.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        passwordChangedAt: new Date(),
      },
    });

    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const html = passwordChangedTemplate(user.name, frontendUrl);
      await this.emailService.sendEmail(
        user.email,
        'Password DapurHPP Berhasil Diubah',
        html,
      );
      this.logger.log(`Notifikasi password changed terkirim ke ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Gagal kirim notifikasi password changed ke ${user.email}`,
        error,
      );
    }

    return {
      message: 'Password berhasil direset. Silakan login dengan password baru.',
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerifyTokenHash: tokenHash,
        emailVerifyExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
        emailVerifiedAt: new Date(),
      },
    });

    // Kirim welcome email setelah verifikasi berhasil
    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const html = welcomeTemplate(user.name, frontendUrl);
      await this.emailService.sendEmail(
        user.email,
        'Selamat Datang di DapurHPP!',
        html,
      );
      this.logger.log(
        `Welcome email terkirim ke ${user.email} setelah verifikasi`,
      );
    } catch (error) {
      this.logger.error(
        `Gagal kirim welcome email ke ${user.email} setelah verifikasi`,
        error,
      );
    }

    return { message: 'Email berhasil diverifikasi' };
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Anti-enumeration: response tetap sama baik ketemu/tidak
    if (user && !user.emailVerified) {
      // Email throttle: cek apakah request terakhir < 15 menit lalu
      if (user.emailVerifyExpiresAt) {
        const tokenCreatedAt = new Date(
          user.emailVerifyExpiresAt.getTime() - 24 * 60 * 60 * 1000,
        );
        const elapsedMs = Date.now() - tokenCreatedAt.getTime();
        if (elapsedMs < this.emailThrottleMs) {
          this.logger.log(
            `Resend verification di-throttle untuk ${user.email} (elapsed: ${Math.round(elapsedMs / 1000)}s)`,
          );
          return {
            message:
              'Jika email terdaftar dan belum diverifikasi, link verifikasi baru telah dikirim.',
          };
        }
      }

      try {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto
          .createHash('sha256')
          .update(token)
          .digest('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerifyTokenHash: tokenHash,
            emailVerifyExpiresAt: expiresAt,
          },
        });

        const frontendUrl =
          this.configService.getOrThrow<string>('FRONTEND_URL');
        const verifyLink = `${frontendUrl}/verify-email?token=${token}`;
        const html = verifyEmailTemplate(user.name, verifyLink, frontendUrl);

        await this.emailService.sendEmail(
          user.email,
          'Verifikasi Email DapurHPP',
          html,
        );
        this.logger.log(`Verify email ulang terkirim ke ${user.email}`);
      } catch (error) {
        this.logger.error(
          `Gagal kirim ulang verify email ke ${user.email}`,
          error,
        );
      }
    }

    return {
      message:
        'Jika email terdaftar dan belum diverifikasi, link verifikasi baru telah dikirim.',
    };
  }
}
