import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import { CreatePenjualanDto } from './dto/create-penjualan.dto';
import { UpdatePenjualanDto } from './dto/update-penjualan.dto';
import { PenjualanQueryDto } from './dto/penjualan-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('penjualan')
export class PenjualanController {
  constructor(private readonly penjualanService: PenjualanService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: PenjualanQueryDto) {
    return this.penjualanService.findAll(req.user.id, query.tanggal);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreatePenjualanDto) {
    return this.penjualanService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.penjualanService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdatePenjualanDto,
  ) {
    return this.penjualanService.update(+id, req.user.id, dto);
  }
}
