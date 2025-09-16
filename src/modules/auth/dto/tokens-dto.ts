import { IsString } from 'class-validator';

export class TokensDto {
  @IsString()
  readonly accessToken!: string;
  @IsString()
  readonly refreshToken!: string;
}
