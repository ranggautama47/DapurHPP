import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { testEmailTemplate } from './templates/test-email.template';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private readonly configService: ConfigService) {}

  @Get('test')
  async testEmail(@Query('to') to: string) {
    if (process.env.NODE_ENV !== 'development') {
      throw new BadRequestException('Endpoint ini hanya untuk testing di development mode');
    }

    if (!to) {
      throw new BadRequestException('Query parameter "to" wajib diisi');
    }

    // PAKAI AWAIT AGAR JIKA ERROR, CONTROLLER LANGSUNG BIFANG ERROR 500
    await this.emailService.sendEmail(
      to,
      'Test DapurHPP — Konfirmasi EmailService Berfungsi',
      testEmailTemplate(this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'),
    );

    return { message: `Email test terkirim ke ${to}` };
  }
}