import { IsString } from 'class-validator';

export class VerifyChangeEmailDto {
  @IsString()
  token!: string;
}
