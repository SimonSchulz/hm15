import { IsString, IsUUID } from 'class-validator';

export class ConfirmCodeDto {
  @IsString()
  @IsUUID()
  readonly code!: string;
}
