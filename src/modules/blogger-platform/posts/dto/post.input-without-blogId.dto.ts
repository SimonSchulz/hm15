import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

export class PostInputWithoutBlogIdDto {
  @IsStringWithTrim(3, 30)
  title!: string;
  @IsStringWithTrim(3, 100)
  shortDescription!: string;
  @IsStringWithTrim(3, 1000)
  content!: string;
}
