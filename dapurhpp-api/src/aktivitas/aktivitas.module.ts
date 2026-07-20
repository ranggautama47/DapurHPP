import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AktivitasService } from './aktivitas.service';
import { AktivitasController } from './aktivitas.controller';

@Module({
  imports: [AuthModule],
  providers: [AktivitasService],
  controllers: [AktivitasController],
})
export class AktivitasModule {}
