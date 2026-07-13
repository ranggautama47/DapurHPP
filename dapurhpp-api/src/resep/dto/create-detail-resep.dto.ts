import { IsInt, IsNumber, IsString, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { Satuan } from '@prisma/client';

export class CreateDetailResepDto {
  @IsInt()
  @Min(1)
  bahanBakuId: number;

  @IsNumber()
  @Min(0.001)
  jumlah: number;

  @IsEnum(Satuan)
  satuan: Satuan;
}