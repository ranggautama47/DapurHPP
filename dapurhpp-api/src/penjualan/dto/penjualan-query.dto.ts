import { IsISO8601, IsOptional } from 'class-validator';

export class PenjualanQueryDto {
  @IsOptional()
  @IsISO8601()
  tanggal?: string;
}
