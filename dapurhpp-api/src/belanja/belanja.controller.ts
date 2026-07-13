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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BelanjaService } from './belanja.service';
import { CreateBelanjaDto } from './dto/create-belanja.dto';
import { UpdateBelanjaDto } from './dto/update-belanja.dto';
import { BelanjaQueryDto } from './dto/belanja-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('belanja')
export class BelanjaController {
  constructor(private readonly belanjaService: BelanjaService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query() query: BelanjaQueryDto,
  ) {
    return this.belanjaService.findAll(req.user.id, query.tanggal);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: any, @Body() dto: CreateBelanjaDto) {
    return this.belanjaService.create(req.user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.belanjaService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateBelanjaDto,
  ) {
    return this.belanjaService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.belanjaService.remove(+id, req.user.id);
  }
}