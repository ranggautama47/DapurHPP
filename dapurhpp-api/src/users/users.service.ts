import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { passwordChangedTemplate } from '../email/templates/password-changed.template';
import { changeEmailTemplate } from '../email/templates/change-email.template';
import { emailChangeAlertTemplate } from '../email/templates/email-change-alert.template';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { randomUUID } from 'crypto';
import { join, extname, basename } from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

const EMAIL_THROTTLE_MS = 15 * 60 * 1000; // 15 menit

const profileSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  namaUsaha: true,
  nomorHp: true,
  fontSize: true,
  notifAplikasi: true,
  notifStok: true,
  notifPenjualan: true,
  avatarUrl: true,
  lastLoginAt: true,
  passwordChangedAt: true,
  emailVerifiedAt: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // Email throttle: 15 menit cooldown antar kirim email
  private readonly emailThrottleMs = 15 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async getProfile(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: profileSelect,
    });
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const hasField =
      dto.name !== undefined ||
      dto.namaUsaha !== undefined ||
      dto.nomorHp !== undefined ||
      dto.fontSize !== undefined ||
      dto.notifAplikasi !== undefined ||
      dto.notifStok !== undefined ||
      dto.notifPenjualan !== undefined;

    if (!hasField) {
      return this.getProfile(id);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.namaUsaha !== undefined && { namaUsaha: dto.namaUsaha }),
        ...(dto.nomorHp !== undefined && { nomorHp: dto.nomorHp }),
        ...(dto.fontSize !== undefined && { fontSize: dto.fontSize }),
        ...(dto.notifAplikasi !== undefined && {
          notifAplikasi: dto.notifAplikasi,
        }),
        ...(dto.notifStok !== undefined && { notifStok: dto.notifStok }),
        ...(dto.notifPenjualan !== undefined && {
          notifPenjualan: dto.notifPenjualan,
        }),
      },
    });

    return this.getProfile(id);
  }

  async updateEmail(id: number, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
        name: true,
        email: true,
        emailChangeExpiresAt: true,
      },
    });
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Password saat ini salah');
    }

    const trimmedEmail = dto.newEmail.trim().toLowerCase();

    if (trimmedEmail === user.email) {
      throw new BadRequestException(
        'Email baru harus berbeda dari email saat ini',
      );
    }

    // Cek apakah email sudah dipakai user lain (cek kolom email DAN pendingEmail)
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: trimmedEmail }, { pendingEmail: trimmedEmail }],
        NOT: { id },
      },
    });
    if (existing) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Email throttle: cek apakah masih dalam window 15 menit sejak token terakhir dibuat
    if (user.emailChangeExpiresAt) {
      const tokenCreatedAt = new Date(
        user.emailChangeExpiresAt.getTime() - 60 * 60 * 1000,
      );
      const elapsedMs = Date.now() - tokenCreatedAt.getTime();
      if (elapsedMs < EMAIL_THROTTLE_MS) {
        this.logger.log(
          `Change email di-throttle untuk user ${id} (elapsed: ${Math.round(elapsedMs / 1000)}s)`,
        );
        return {
          message:
            'Link verifikasi telah dikirim ke email baru Anda. Silakan cek inbox untuk menyelesaikan perubahan.',
        };
      }
    }

    // Generate token baru (invalidate token lama kalau ada — overwrite, bukan append)
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await this.prisma.user.update({
      where: { id },
      data: {
        pendingEmail: trimmedEmail,
        emailChangeTokenHash: tokenHash,
        emailChangeExpiresAt: expiresAt,
      },
    });

    // Kirim email verifikasi ke pendingEmail (BUKAN ke email lama)
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const verifyLink = `${frontendUrl}/verify-change-email?token=${token}`;

    try {
      const html = changeEmailTemplate(user.name, verifyLink, frontendUrl);
      await this.emailService.sendEmail(
        trimmedEmail,
        'Verifikasi Perubahan Email DapurHPP',
        html,
      );
      this.logger.log(`Change email verification terkirim ke ${trimmedEmail}`);
    } catch (error) {
      this.logger.error(
        `Gagal kirim change email verification ke ${trimmedEmail}`,
        error,
      );
    }

    return {
      message:
        'Link verifikasi telah dikirim ke email baru Anda. Silakan cek inbox untuk menyelesaikan perubahan.',
    };
  }

  async verifyChangeEmail(id: number, token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        id,
        emailChangeTokenHash: tokenHash,
        emailChangeExpiresAt: { gt: new Date() },
      },
    });

    if (!user || !user.pendingEmail) {
      throw new BadRequestException('Token tidak valid atau sudah kedaluwarsa');
    }

    const oldEmail = user.email;
    const newEmail = user.pendingEmail;

    await this.prisma.user.update({
      where: { id },
      data: {
        email: newEmail,
        pendingEmail: null,
        emailChangeTokenHash: null,
        emailChangeExpiresAt: null,
        emailVerified: false,
        emailVerifiedAt: null,
      },
    });

    // Kirim alert ke email LAMA setelah perubahan sukses
    try {
      const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
      const html = emailChangeAlertTemplate(
        user.name,
        oldEmail,
        newEmail,
        frontendUrl,
      );
      await this.emailService.sendEmail(
        oldEmail,
        'Email DapurHPP Berhasil Diubah',
        html,
      );
      this.logger.log(`Email change alert terkirim ke ${oldEmail}`);
    } catch (error) {
      this.logger.error(`Gagal kirim email change alert ke ${oldEmail}`, error);
    }

    this.logger.log(`User ${id} changed email from ${oldEmail} to ${newEmail}`);

    return { message: 'Email berhasil diperbarui.' };
  }

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { password: true, name: true, email: true },
    });

    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    const isCurrentValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentValid) {
      throw new BadRequestException('Password saat ini salah');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        'Password baru harus berbeda dari password saat ini',
      );
    }

    if (dto.newPassword.length < 6) {
      throw new BadRequestException('Password baru minimal 6 karakter');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
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

    return { message: 'Password berhasil diubah' };
  }

  async updateAvatar(id: number, file: Express.Multer.File) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipe file tidak valid. Hanya JPG, PNG, dan WebP yang diizinkan.',
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Ukuran file maksimal 2MB.');
    }

    const buffer = file.buffer;
    if (!buffer) {
      throw new BadRequestException('File tidak dapat diproses');
    }

    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(buffer);

    const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!detected || !allowedExts.includes(detected.ext)) {
      throw new BadRequestException(
        'File bukan gambar yang valid. Hanya JPG, PNG, dan WebP yang diizinkan.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    if (user.avatarUrl) {
      const oldPath = join(
        process.cwd(),
        'uploads',
        'avatars',
        basename(user.avatarUrl),
      );
      try {
        await unlink(oldPath);
      } catch {
        // ignore if old file doesn't exist
      }
    }

    const ext = '.' + detected.ext;
    const filename = `${randomUUID()}${ext}`;
    const uploadDir = join(process.cwd(), 'uploads', 'avatars');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;
    await this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
    });

    return this.getProfile(id);
  }
}
