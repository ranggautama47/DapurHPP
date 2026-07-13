import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Satuan } from '@prisma/client';

export class CreateBahanBakuDto {
  @IsString()
  @MinLength(1)
  nama!: string;

  @IsEnum(Satuan)
  satuan!: Satuan;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hargaTerakhir?: number = 0;
}
