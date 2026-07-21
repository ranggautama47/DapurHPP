import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LaporanQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 7;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
