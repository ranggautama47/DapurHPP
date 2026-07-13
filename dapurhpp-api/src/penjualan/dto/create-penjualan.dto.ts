import { IsInt, IsISO8601, IsNumber, Min } from 'class-validator';

export class CreatePenjualanDto {
  @IsInt()
  @Min(1)
  produksiId!: number;

  @IsISO8601()
  tanggal!: string;

  @IsInt()
  @Min(1)
  terjual!: number;

  @IsNumber()
  @Min(0)
  hargaJual!: number;
}
