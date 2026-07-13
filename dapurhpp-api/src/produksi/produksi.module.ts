import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResepModule } from '../resep/resep.module';
import { ProduksiService } from './produksi.service';
import { ProduksiController } from './produksi.controller';

@Module({
  imports: [AuthModule, ResepModule],
  providers: [ProduksiService],
  controllers: [ProduksiController],
  exports: [ProduksiService],
})
export class ProduksiModule {}
