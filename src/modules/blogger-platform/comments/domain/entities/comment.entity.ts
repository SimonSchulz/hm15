import { RequestDataEntity } from '../../../../../core/dto/request.data.entity';

export class CommentEntity {
  content: string;
  commentatorInfo: RequestDataEntity;
  createdAt: string;
  postId: string;
  constructor(data: {
    content: string;
    commentatorInfo: RequestDataEntity;
    postId: string;
  }) {
    this.content = data.content;
    this.commentatorInfo = data.commentatorInfo;
    this.createdAt = new Date().toISOString();
    this.postId = data.postId;
  }
}
