import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateLikeStatusCommand } from '../commands/likes.commands';
import { LikesRepository } from '../../infrasructure/repositories/likes.repository';
import { CommentsQueryRepository } from '../../../comments/infrastructure/repositories/comments.query.repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/repositories/posts.query.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler
  implements ICommandHandler<UpdateLikeStatusCommand, void>
{
  constructor(
    private readonly likesRepo: LikesRepository,
    private readonly commentsQueryRepo: CommentsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) {}

  async execute(command: UpdateLikeStatusCommand): Promise<void> {
    const { userId, targetId, newStatus } = command;
    const comment = await this.commentsQueryRepo.findById(targetId);
    const post = await this.postsQueryRepo.findById(targetId);
    if (!comment && !post) throw new NotFoundException('Incorrect target id');

    const currentStatus = await this.likesRepo.getUserStatus(userId, targetId);
    if (currentStatus === newStatus) return;

    await this.likesRepo.setUserStatus(userId, targetId, newStatus);
  }
}
