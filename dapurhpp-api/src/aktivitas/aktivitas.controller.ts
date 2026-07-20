import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AktivitasService } from './aktivitas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryAktivitasDto } from './dto/query-aktivitas.dto';
import { AktivitasItem } from './aktivitas.service';

interface AktivitasResponse {
  data: AktivitasItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@UseGuards(JwtAuthGuard)
@Controller('aktivitas')
export class AktivitasController {
  constructor(private readonly aktivitasService: AktivitasService) {}

  @Get()
  async findAll(@Request() req: any, @Query() query: QueryAktivitasDto): Promise<AktivitasResponse> {
    return this.aktivitasService.findAll(req.user.id, query);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.aktivitasService.getStats(req.user.id);
  }
}
