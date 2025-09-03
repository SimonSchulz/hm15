import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsMongoId, IsString } from 'class-validator';

export class PostInputDto {
  @IsStringWithTrim(3, 30)
  title!: string;
  @IsStringWithTrim(3, 100)
  shortDescription!: string;
  @IsStringWithTrim(3, 1000)
  content!: string;
  @IsString()
  @IsMongoId()
  blogId!: string;
}
