import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BahanBakuModule } from './bahan-baku/bahan-baku.module';
import { SupplierModule } from './supplier/supplier.module';
import { ResepModule } from './resep/resep.module';
import { BelanjaModule } from './belanja/belanja.module';
import { ProduksiModule } from './produksi/produksi.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { PengeluaranLainModule } from './pengeluaran-lain/pengeluaran-lain.module';
import { LaporanModule } from './laporan/laporan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    BahanBakuModule,
    SupplierModule,
    ResepModule,
    BelanjaModule,
    ProduksiModule,
    PenjualanModule,
    PengeluaranLainModule,
    LaporanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
