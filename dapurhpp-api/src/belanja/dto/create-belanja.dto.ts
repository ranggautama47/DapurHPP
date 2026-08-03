import {
  IsInt,
  IsNumber,
  IsString,
  IsNotEmpty,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { CreateDetailBelanjaDto } from './create-detail-belanja.dto';

export class CreateBelanjaDto {
  @IsDateString()
  @IsNotEmpty()
  tanggal: string;

  @IsOptional()
  @IsString()
  catatan?: string;

  @IsNotEmpty({ message: 'Detail belanja tidak boleh kosong' })
  detailBelanja: CreateDetailBelanjaDto[];
}
