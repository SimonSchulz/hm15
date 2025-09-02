import { IsStringWithTrim } from '../../../core/decorators/validation/is-string-with-trim';
import {
  loginConstraints,
  passwordConstraints,
} from '../../../core/constraints/constraints';
import { IsEmail, IsString } from 'class-validator';

export class InputUserDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login!: string;
  @IsStringWithTrim(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  password!: string;
  @IsString()
  @IsEmail()
  email!: string;
}
