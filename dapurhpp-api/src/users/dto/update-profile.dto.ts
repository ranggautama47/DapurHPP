import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  namaUsaha?: string;

  @IsOptional()
  @IsString()
  nomorHp?: string;

  @IsOptional()
  @IsIn(['kecil', 'sedang', 'besar'])
  fontSize?: string;

  @IsOptional()
  @IsBoolean()
  notifAplikasi?: boolean;

  @IsOptional()
  @IsBoolean()
  notifStok?: boolean;

  @IsOptional()
  @IsBoolean()
  notifPenjualan?: boolean;
}
