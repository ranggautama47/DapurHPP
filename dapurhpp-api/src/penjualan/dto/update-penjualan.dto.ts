import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { StatusPenjualan } from '@prisma/client';

export class UpdatePenjualanDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  terjual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hargaJual?: number;

  @IsOptional()
  @IsEnum(StatusPenjualan)
  status?: StatusPenjualan;
}
