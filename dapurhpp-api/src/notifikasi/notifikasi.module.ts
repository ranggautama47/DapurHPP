import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotifikasiService } from './notifikasi.service';
import { NotifikasiController } from './notifikasi.controller';

@Module({
  imports: [AuthModule],
  providers: [NotifikasiService],
  controllers: [NotifikasiController],
})
export class NotifikasiModule {}
