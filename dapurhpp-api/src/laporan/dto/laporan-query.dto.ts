import { IsOptional, IsString, IsDateString } from 'class-validator';

export class LaporanQueryDto {
  @IsOptional()
  @IsString()
  periode?: string; // contoh: '7', '30', 'custom'

  @IsOptional()
  @IsDateString()
  tanggalMulai?: string;

  @IsOptional()
  @IsDateString()
  tanggalAkhir?: string;
}