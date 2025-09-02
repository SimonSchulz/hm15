import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, CommentModel } from '../schemas/comment.schema';
import { CommentsQueryParams } from '../../dto/comments-query-params.input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentsViewDto } from '../../dto/comments.view-dto';
import { LikesInfo } from '../../../likes/dto/likes-info.dto';
@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async findById(id: string) {
    return this.commentModel.findById(id).lean();
  }

  async findCommentsByPostId(postId: string, query: CommentsQueryParams) {
    const filter = { postId };
    const comments = await this.commentModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.commentModel.countDocuments(filter).exec();
    const likesInfo = LikesInfo.defaultValues();
    const items = comments.map((comment) =>
      CommentsViewDto.mapToView(comment, likesInfo),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
