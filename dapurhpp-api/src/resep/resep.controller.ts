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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResepService } from './resep.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';

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
}