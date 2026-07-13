import { IsInt, IsNumber, IsString, IsNotEmpty, Min, IsOptional, IsEnum } from 'class-validator';
import { Satuan } from '@prisma/client';

export class CreateDetailBelanjaDto {
  @IsInt()
  @Min(1)
  bahanBakuId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  supplierId?: number;

  @IsNumber()
  @Min(0.001)
  jumlah: number;

  @IsEnum(Satuan)
  satuan: Satuan;

  @IsNumber()
  @Min(0)
  hargaSatuan: number;
}