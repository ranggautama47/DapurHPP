import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { AktivitasModule } from './aktivitas/aktivitas.module';
import { NotifikasiModule } from './notifikasi/notifikasi.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 60 }],
    }),
    PrismaModule,
    EmailModule,
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
    AktivitasModule,
    NotifikasiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}