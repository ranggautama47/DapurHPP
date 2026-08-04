import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const smtpPort = Number(this.configService.getOrThrow<string>('SMTP_PORT'));
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: smtpPort,
      secure: smtpPort === 465,
      connectionTimeout: 10000, // 10 detik — batas waktu koneksi awal ke SMTP server
      greetingTimeout: 10000, // 10 detik — batas waktu menunggu respons greeting SMTP
      socketTimeout: 15000, // 15 detik — batas waktu inaktivitas socket setelah terhubung
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('SMTP_FROM'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email terkirim ke ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(
        `Gagal kirim email ke ${to}: ${error instanceof Error ? error.message : error}`,
      );

      throw new InternalServerErrorException(
        'Gagal mengirim email. Silakan coba lagi nanti.',
      );
    }
  }
}
