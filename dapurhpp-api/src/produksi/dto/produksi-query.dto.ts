import { IsISO8601, IsOptional } from 'class-validator';

export class ProduksiQueryDto {
  @IsOptional()
  @IsISO8601()
  tanggal?: string;
}
