import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';

@Module({
  imports: [AuthModule],
  providers: [LaporanService],
  controllers: [LaporanController],
  exports: [LaporanService],
})
export class LaporanModule {}
