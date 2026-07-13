import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BahanBakuService } from './bahan-baku.service';
import { CreateBahanBakuDto } from './dto/create-bahan-baku.dto';
import { UpdateBahanBakuDto } from './dto/update-bahan-baku.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bahan-baku')
export class BahanBakuController {
  constructor(private readonly bahanBakuService: BahanBakuService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.bahanBakuService.findAll(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreateBahanBakuDto) {
    return this.bahanBakuService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.bahanBakuService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateBahanBakuDto,
  ) {
    return this.bahanBakuService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.bahanBakuService.remove(+id, req.user.id);
    return { message: 'Bahan baku berhasil dihapus' };
  }
}
