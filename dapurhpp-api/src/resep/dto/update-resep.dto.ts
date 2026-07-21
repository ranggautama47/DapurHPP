import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateResepDto } from './create-resep.dto';
import { CreateDetailResepDto } from './create-detail-resep.dto';

export class UpdateResepDto extends PartialType(CreateResepDto) {
  @IsOptional()
  detailResep?: CreateDetailResepDto[];
}
