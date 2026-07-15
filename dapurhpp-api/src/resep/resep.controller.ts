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
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResepService } from './resep.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';
import { resepMulterOptions } from './resep-upload.config';

@UseGuards(JwtAuthGuard)
@Controller('resep')
export class ResepController {
  constructor(private readonly resepService: ResepService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.resepService.findAll(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreateResepDto) {
    return this.resepService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.resepService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateResepDto,
  ) {
    return this.resepService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.resepService.remove(+id, req.user.id);
  }

  @Post(':id/upload-foto')
  @UseInterceptors(FileInterceptor('file', resepMulterOptions))
  async uploadFoto(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return { message: 'Tidak ada file yang diupload' };
    }
    const fotoUrl = `/uploads/resep/${file.filename}`;
    await this.resepService.updateFotoUrl(id, req.user.id, fotoUrl);
    return { fotoUrl, message: 'Foto berhasil diupload' };
  }
}