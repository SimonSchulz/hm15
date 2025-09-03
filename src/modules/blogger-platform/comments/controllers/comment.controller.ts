import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LikesInputDto } from '../../likes/dto/likes.input.dto';
import { CommentsQueryRepository } from '../infrastructure/repositories/comments.query.repository';
import { CommentInputDto } from '../dto/comment.input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { UpdateLikeStatusCommand } from '../../likes/application/commands/likes.commands';
import { JwtAuthGuard } from '../../../auth/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/decorators/transform/extract-user-from-request.decorator';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async getComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsQueryRepository.findById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CommentInputDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, updateCommentDto),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  async updateLikeStatus(
    @ExtractUserFromRequest() user: RequestDataEntity,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() likeStatusDto: LikesInputDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateLikeStatusCommand(
        user.userId,
        commentId,
        likeStatusDto.likeStatus,
      ),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteCommentCommand(commentId));
  }
}
