import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  IsUrl, 
} from 'class-validator';
import { Satuan, KategoriBahan } from '@prisma/client';

export class UpdateBahanBakuDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nama?: string;

  @IsOptional()
  @IsEnum(Satuan)
  satuan?: Satuan;

  @IsOptional()
  @IsEnum(KategoriBahan)
  kategori?: KategoriBahan;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hargaTerakhir?: number;
  @IsOptional()
  @IsUrl()
  fotoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stok?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stokMinimal?: number;
}
