import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateBelanjaDto } from './create-belanja.dto';
import { CreateDetailBelanjaDto } from './create-detail-belanja.dto';

export class UpdateBelanjaDto extends PartialType(CreateBelanjaDto) {
  @IsOptional()
  detailBelanja?: CreateDetailBelanjaDto[];
}