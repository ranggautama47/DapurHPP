import { IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class BelanjaQueryDto {
  @IsOptional()
  @IsDateString()
  tanggal?: string;

  @IsOptional()
  @IsDateString()
  tanggalMulai?: string;

  @IsOptional()
  @IsDateString()
  tanggalAkhir?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  supplierId?: number;
}
