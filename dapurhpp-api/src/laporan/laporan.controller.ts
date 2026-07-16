import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Get('ringkasan')
  async getRingkasan(@Request() req: any, @Query('days') days?: string) {
    const parsedDays = days ? parseInt(days, 10) : 7;
    const safeDays = [7, 30, 90, 180].includes(parsedDays) ? parsedDays : 7;
    return this.laporanService.getRingkasan(req.user.id, safeDays);
  }

  @Get('grafik-laba')
  async getGrafikLaba(@Request() req: any, @Query('days') days?: string) {
    const parsedDays = days ? parseInt(days, 10) : 7;
    const safeDays = [7, 30, 90, 180].includes(parsedDays) ? parsedDays : 7;
    return this.laporanService.getGrafikLaba(req.user.id, safeDays);
  }

  @Get('distribusi-hpp')
  async getDistribusiHpp(@Request() req: any) {
    return this.laporanService.getDistribusiHpp(req.user.id);
  }

  @Get('aktivitas-terbaru')
  async getAktivitasTerbaru(@Request() req: any) {
    return this.laporanService.getAktivitasTerbaru(req.user.id);
  }

  @Get('produk-terlaris')
  async getProdukTerlaris(@Request() req: any) {
    return this.laporanService.getProdukTerlaris(req.user.id);
  }
}