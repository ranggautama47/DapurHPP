import { IsDateString, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreatePengeluaranLainDto {
  @IsDateString()
  tanggal!: string;

  @IsString()
  @MinLength(1)
  nama!: string;

  @IsNumber()
  @Min(0)
  jumlah!: number;
}