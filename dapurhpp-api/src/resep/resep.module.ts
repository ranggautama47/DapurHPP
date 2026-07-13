import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ResepService } from './resep.service';
import { ResepController } from './resep.controller';

@Module({
  imports: [AuthModule],
  providers: [ResepService],
  controllers: [ResepController],
  exports: [ResepService],
})
export class ResepModule {}