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

export class CreateBahanBakuDto {
  @IsString()
  @MinLength(1)
  nama!: string;

  @IsEnum(Satuan)
  satuan!: Satuan;

  @IsEnum(KategoriBahan)
  @IsOptional()
  kategori?: KategoriBahan = KategoriBahan.LAINNYA;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hargaTerakhir?: number = 0;

  @IsOptional()
  @IsUrl()
  fotoUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stok?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stokMinimal?: number = 0;
}
