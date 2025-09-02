import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';
import { passwordConstraints } from '../../../core/constraints/constraints';

export class LoginInputDto {
  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  password!: string;
  @IsString()
  loginOrEmail!: string;
}
