import { IsInt, Min } from 'class-validator';

export class UpdateProduksiDto {
  @IsInt()
  @Min(1)
  hasilNyata!: number;
}
