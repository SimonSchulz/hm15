import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/repositories/comments.query.repository';
import { CommentInputDto } from '../../dto/comment.input.dto';
import { RequestDataEntity } from '../../../../../core/dto/request.data.entity';
export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly dto: CommentInputDto,
    public readonly user: RequestDataEntity,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand, void>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { id, dto, user } = command;

    const comment = await this.commentsQueryRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    if (comment.commentatorInfo.userId !== user.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.update(id, dto);
  }
}
