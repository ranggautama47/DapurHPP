import { IsOptional, IsDateString } from 'class-validator';

export class BelanjaQueryDto {
  @IsOptional()
  @IsDateString()
  tanggal?: string;
}