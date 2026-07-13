import { IsInt, IsISO8601, Min } from 'class-validator';

export class CreateProduksiDto {
  @IsInt()
  @Min(1)
  resepId!: number;

  @IsISO8601()
  tanggal!: string;

  @IsInt()
  @Min(1)
  hasilNyata!: number;
}
