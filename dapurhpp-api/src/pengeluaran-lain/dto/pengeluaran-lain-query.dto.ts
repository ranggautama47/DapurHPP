import { IsDateString, IsOptional } from 'class-validator';

export class PengeluaranLainQueryDto {
  @IsOptional()
  @IsDateString()
  tanggal?: string;
}
