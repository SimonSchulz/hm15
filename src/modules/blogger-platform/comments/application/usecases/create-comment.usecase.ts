import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WithId } from 'mongodb';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentsRepository } from '../../infrastructure/repositories/comments.repository';
import { CommentInputDto } from '../../dto/comment.input.dto';
import { RequestDataEntity } from '../../../../../core/dto/request.data.entity';

export class CreateCommentCommand {
  constructor(
    public readonly dto: CommentInputDto,
    public readonly info: RequestDataEntity,
    public readonly postId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand, WithId<CommentEntity>>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<WithId<CommentEntity>> {
    const { dto, info, postId } = command;
    const newComment = new CommentEntity({
      content: dto.content,
      commentatorInfo: {
        userId: info.userId,
        userLogin: info.userLogin,
      },
      postId,
    });

    return this.commentsRepository.create(newComment);
  }
}
