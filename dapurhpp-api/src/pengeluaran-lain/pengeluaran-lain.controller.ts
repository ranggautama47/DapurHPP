import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PengeluaranLainService } from './pengeluaran-lain.service';
import { CreatePengeluaranLainDto } from './dto/create-pengeluaran-lain.dto';
import { UpdatePengeluaranLainDto } from './dto/update-pengeluaran-lain.dto';
import { PengeluaranLainQueryDto } from './dto/pengeluaran-lain-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('pengeluaran-lain')
export class PengeluaranLainController {
  constructor(private readonly service: PengeluaranLainService) {}

  @Get()
  findAll(@Req() req: any, @Query() query: PengeluaranLainQueryDto) {
    return this.service.findAll(req.user.id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: any, @Body() dto: CreatePengeluaranLainDto) {
    return this.service.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePengeluaranLainDto) {
    return this.service.update(Number(id), req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.service.remove(Number(id), req.user.id);
    return { message: 'Pengeluaran lain berhasil dihapus' };
  }
}