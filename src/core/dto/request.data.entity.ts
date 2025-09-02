import { IsString } from 'class-validator';
import { IsStringWithTrim } from '../decorators/validation/is-string-with-trim';
import { loginConstraints } from '../constraints/constraints';

export class RequestDataEntity {
  @IsString()
  userId!: string;
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  userLogin!: string;
}
