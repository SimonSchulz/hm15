import { PostDocument } from '../infrastructure/schemas/post.schema';
import { ExtendedLikesInfo } from '../../likes/dto/extended-likes-info.dto';

export class PostViewDto {
  id!: string;
  title!: string;
  shortDescription!: string;
  content!: string;
  blogId!: string;
  blogName!: string;
  createdAt!: string;
  extendedLikesInfo!: ExtendedLikesInfo;

  static mapToView(
    post: PostDocument,
    extendedLikesInfo: ExtendedLikesInfo,
  ): PostViewDto {
    const dto = new PostViewDto();
    dto.title = post.title;
    dto.blogId = post.blogId;
    dto.title = post.title;
    dto.content = post.content;
    dto.blogName = post.blogName;
    dto.shortDescription = post.shortDescription;
    dto.createdAt = post.createdAt;
    dto.id = post._id.toString();
    dto.extendedLikesInfo = extendedLikesInfo;
    return dto;
  }
}
