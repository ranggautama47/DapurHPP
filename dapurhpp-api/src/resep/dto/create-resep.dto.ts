import { IsInt, IsString, IsNotEmpty, MinLength, IsNumber, Min, IsOptional } from 'class-validator';
import { CreateDetailResepDto } from './create-detail-resep.dto';

export class CreateResepDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  nama: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  estimasiHasil: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hargaJual?: number = 0;

  @IsNotEmpty({ message: 'Detail resep tidak boleh kosong' })
  detailResep: CreateDetailResepDto[];
}