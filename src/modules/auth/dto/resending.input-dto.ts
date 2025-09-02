import { IsEmail, IsString } from 'class-validator';

export class ResendingInputDto {
  @IsString()
  @IsEmail()
  readonly email!: string;
}
