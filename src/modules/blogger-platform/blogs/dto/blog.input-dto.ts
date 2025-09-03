import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { Matches } from 'class-validator';

export class BlogInputDto {
  @IsStringWithTrim(3, 15)
  name!: string;
  @IsStringWithTrim(3, 500)
  description!: string;
  @IsStringWithTrim(3, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: 'websiteUrl must be a valid URL starting with https://',
    },
  )
  websiteUrl!: string;
}
