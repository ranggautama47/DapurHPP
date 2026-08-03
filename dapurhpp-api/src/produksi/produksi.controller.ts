import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProduksiService } from './produksi.service';
import { CreateProduksiDto } from './dto/create-produksi.dto';
import { UpdateProduksiDto } from './dto/update-produksi.dto';
import { ProduksiQueryDto } from './dto/produksi-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('produksi')
export class ProduksiController {
  constructor(private readonly produksiService: ProduksiService) {}

  @Get()
  findAll(@Request() req: any, @Query() query: ProduksiQueryDto) {
    return this.produksiService.findAll(req.user.id, query.tanggal);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreateProduksiDto) {
    return this.produksiService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.produksiService.findOne(+id, req.user.id);
  }

  @Patch(':id/selesai')
  @HttpCode(HttpStatus.OK)
  selesai(@Param('id') id: string, @Request() req: any) {
    return this.produksiService.selesai(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateProduksiDto,
  ) {
    return this.produksiService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.produksiService.remove(+id, req.user.id);
  }
}
