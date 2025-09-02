import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { LikesInputDto } from '../../likes/dto/likes.input.dto';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { CommentInputDto } from '../dto/comment.input.dto';
import { LikesService } from '../../likes/application/likes.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}

  @Get(':id')
  async getComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsQueryRepository.findById(id);
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CommentInputDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, updateCommentDto),
    );
  }

  @Put(':commentId/like-status')
  async updateLikeStatus(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() likeStatusDto: LikesInputDto,
  ): Promise<void> {
    return this.likesService.updateLikeStatus(
      commentId,
      commentId,
      likeStatusDto.likeStatus,
    );
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteCommentCommand(commentId));
  }
}
