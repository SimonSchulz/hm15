import { LikeStatus } from './likes.type';
import { IsEnum, IsString } from 'class-validator';

export class LikesInputDto {
  @IsString()
  @IsEnum(LikeStatus)
  likeStatus!: LikeStatus;
}
