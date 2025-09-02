import { CommentDocument } from '../infrastructure/schemas/comment.schema';
import { LikesInfo } from '../../likes/dto/likes-info.dto';

export class CommentsViewDto {
  id!: string;
  content!: string;
  commentatorInfo!: {
    userId: string;
    userLogin: string;
  };
  createdAt!: string;
  likesInfo!: LikesInfo;

  static mapToView(
    comment: CommentDocument,
    likesInfo: LikesInfo,
  ): CommentsViewDto {
    const dto = new CommentsViewDto();
    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.createdAt = new Date().toISOString();
    dto.likesInfo = likesInfo;
    return dto;
  }
}
