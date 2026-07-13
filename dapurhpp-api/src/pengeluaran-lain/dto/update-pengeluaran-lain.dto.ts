import { PartialType } from '@nestjs/mapped-types';
import { CreatePengeluaranLainDto } from './create-pengeluaran-lain.dto';

export class UpdatePengeluaranLainDto extends PartialType(CreatePengeluaranLainDto) {}