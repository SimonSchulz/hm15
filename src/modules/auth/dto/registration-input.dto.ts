import { IsEmail } from 'class-validator';
import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';
import {
  loginConstraints,
  passwordConstraints,
} from '../../../core/constraints/constraints';

export class RegistrationInputDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  readonly login!: string;

  @IsEmail()
  readonly email!: string;

  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  readonly password!: string;
}
