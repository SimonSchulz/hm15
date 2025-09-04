import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
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
import { JwtOptionalAuthGuard } from '../../../auth/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../../core/decorators/transform/extract-user-if-exists-from-request.decorator';
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  async getComment(
    @Param('id') id: string,
    @ExtractUserIfExistsFromRequest() user?: RequestDataEntity,
  ) {
    const comment = await this.commentsQueryRepository.findById(
      id,
      user?.userId,
    );
    if (!comment) {
      throw new NotFoundException('Could not find comment');
    }
    return comment;
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CommentInputDto,
    @ExtractUserFromRequest() user: RequestDataEntity,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, updateCommentDto, user),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @ExtractUserFromRequest() user: RequestDataEntity,
    @Param('commentId') commentId: string,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('commentId') commentId: string,
    @ExtractUserFromRequest() user: RequestDataEntity,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteCommentCommand(commentId, user));
  }
}
