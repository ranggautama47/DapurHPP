import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotifikasiService } from './notifikasi.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifikasi')
export class NotifikasiController {
  constructor(private readonly notifikasiService: NotifikasiService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.notifikasiService.findAll(req.user.id);
  }

  @Post('generate')
  async generate(@Request() req: any) {
    return this.notifikasiService.generate(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notifikasiService.markAsRead(Number(id), req.user.id);
  }

  @Patch('baca-semua')
  async markAllAsRead(@Request() req: any) {
    return this.notifikasiService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.notifikasiService.remove(Number(id), req.user.id);
  }
}
