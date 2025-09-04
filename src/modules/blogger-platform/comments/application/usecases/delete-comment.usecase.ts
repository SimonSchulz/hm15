import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/repositories/comments.query.repository';
import { RequestDataEntity } from '../../../../../core/dto/request.data.entity';
export class DeleteCommentCommand {
  constructor(
    public readonly id: string,
    public readonly user: RequestDataEntity,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id, user } = command;

    const comment = await this.commentsQueryRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    if (comment.commentatorInfo.userId !== user.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.delete(id);
  }
}
