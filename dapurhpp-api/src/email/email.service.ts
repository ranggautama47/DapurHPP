import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: Number(this.configService.getOrThrow<string>('SMTP_PORT')),
      secure: true, // Port 465 SSL
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
      this.logger.error(`Gagal kirim email ke ${to}: ${error instanceof Error ? error.message : error}`);
      
      // MENGEMBALIKAN ERROR HTTP 500 DENGAN DETAIL DARI GMAIL/NODEMAILER
      throw new InternalServerErrorException(
        `Gagal mengirim email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}