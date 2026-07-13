import { Module } from '@nestjs/common';
import { BahanBakuService } from './bahan-baku.service';
import { BahanBakuController } from './bahan-baku.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [BahanBakuService],
  controllers: [BahanBakuController],
})
export class BahanBakuModule {}
