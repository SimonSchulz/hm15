import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { CommentsQueryRepository } from '../../infrastructure/repositories/comments.query.repository';

export class DeleteCommentCommand {
  constructor(public readonly id: string) {}
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
    const { id } = command;

    const comment = await this.commentsQueryRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    await this.commentsRepository.delete(id);
  }
}
