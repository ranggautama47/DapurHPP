import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeEmailDto {
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  newEmail!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentPassword!: string;
}
