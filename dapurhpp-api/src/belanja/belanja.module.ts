import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BelanjaService } from './belanja.service';
import { BelanjaController } from './belanja.controller';

@Module({
  imports: [AuthModule],
  providers: [BelanjaService],
  controllers: [BelanjaController],
  exports: [BelanjaService],
})
export class BelanjaModule {}
