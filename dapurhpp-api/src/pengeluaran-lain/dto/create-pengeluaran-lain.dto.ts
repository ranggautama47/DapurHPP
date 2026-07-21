import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { KategoriPengeluaran } from '@prisma/client';

export class CreatePengeluaranLainDto {
  @IsDateString()
  tanggal!: string;

  @IsString()
  @MinLength(1)
  nama!: string;

  @IsNumber()
  @Min(0)
  jumlah!: number;

  @IsEnum(KategoriPengeluaran)
  kategori!: KategoriPengeluaran;
}
