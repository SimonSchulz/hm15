import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, CommentModel } from '../schemas/comment.schema';
import { CommentsQueryParams } from '../../dto/comments-query-params.input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentsViewDto } from '../../dto/comments.view-dto';
import { CommandBus } from '@nestjs/cqrs';
import { GetLikesInfoCommand } from '../../../likes/application/commands/likes.commands';
import { LikesInfo } from '../../../likes/dto/likes-info.dto';
@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly commandBus: CommandBus,
  ) {}

  async findById(id: string, userId?: string) {
    const result = await this.commentModel.findById(id);
    if (!result) {
      return false;
    }
    const likesInfo: LikesInfo = await this.commandBus.execute(
      new GetLikesInfoCommand(id, userId),
    );
    return CommentsViewDto.mapToView(result, likesInfo);
  }

  async findCommentsByPostId(
    postId: string,
    query: CommentsQueryParams,
    userId?: string,
  ) {
    const filter = { postId };
    const comments = await this.commentModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.commentModel.countDocuments(filter).exec();
    const likesInfo: LikesInfo = await this.commandBus.execute(
      new GetLikesInfoCommand(postId, userId),
    );
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
