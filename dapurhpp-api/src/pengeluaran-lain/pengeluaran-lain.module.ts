import { Module } from '@nestjs/common';
import { PengeluaranLainService } from './pengeluaran-lain.service';
import { PengeluaranLainController } from './pengeluaran-lain.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PengeluaranLainService],
  controllers: [PengeluaranLainController],
  exports: [PengeluaranLainService],
})
export class PengeluaranLainModule {}
