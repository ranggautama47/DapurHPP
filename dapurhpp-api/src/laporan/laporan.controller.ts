import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LaporanQueryDto } from './dto/laporan-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Get('ringkasan')
  async getRingkasan(@Request() req: any, @Query() query: LaporanQueryDto) {
    return this.laporanService.getRingkasan(req.user.id, query.days);
  }

  @Get('grafik-laba')
  async getGrafikLaba(@Request() req: any, @Query() query: LaporanQueryDto) {
    return this.laporanService.getGrafikLaba(req.user.id, query.days);
  }

  @Get('distribusi-hpp')
  async getDistribusiHpp(@Request() req: any, @Query() query: LaporanQueryDto) {
    return this.laporanService.getDistribusiHpp(req.user.id, query.days);
  }

  @Get('aktivitas-terbaru')
  async getAktivitasTerbaru(@Request() req: any, @Query() query: LaporanQueryDto) {
    return this.laporanService.getAktivitasTerbaru(req.user.id, query.days);
  }

  @Get('produk-terlaris')
  async getProdukTerlaris(@Request() req: any, @Query() query: LaporanQueryDto) {
    return this.laporanService.getProdukTerlaris(req.user.id, query.days);
  }
}