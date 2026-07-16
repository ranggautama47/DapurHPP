import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Tambahkan impor ini
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';

@Module({
  imports: [
    AuthModule,
    PrismaModule, 
  ],
  providers: [LaporanService],
  controllers: [LaporanController],
  exports: [LaporanService],
})
export class LaporanModule {}
