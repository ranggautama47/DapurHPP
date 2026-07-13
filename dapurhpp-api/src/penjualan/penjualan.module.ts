import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PenjualanService } from './penjualan.service';
import { PenjualanController } from './penjualan.controller';

@Module({
  imports: [AuthModule],
  providers: [PenjualanService],
  controllers: [PenjualanController],
  exports: [PenjualanService],
})
export class PenjualanModule {}
