import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetExtendedLikesInfoCommand } from '../commands/likes.commands';
import { ExtendedLikesInfo } from '../../dto/extended-likes-info.dto';
import { LikesRepository } from '../../infrasructure/repositories/likes.repository';
import { LikeStatus } from '../../dto/likes.type';

@CommandHandler(GetExtendedLikesInfoCommand)
export class GetExtendedLikesInfoHandler
  implements ICommandHandler<GetExtendedLikesInfoCommand, ExtendedLikesInfo>
{
  constructor(private readonly likesRepo: LikesRepository) {}

  async execute(
    command: GetExtendedLikesInfoCommand,
  ): Promise<ExtendedLikesInfo> {
    const { targetId, userId } = command;
    const [likesCount, dislikesCount, myStatus, newestLikes] =
      await Promise.all([
        this.likesRepo.countLikes(targetId, LikeStatus.Like),
        this.likesRepo.countLikes(targetId, LikeStatus.Dislike),
        userId
          ? this.likesRepo.getUserStatus(userId, targetId)
          : LikeStatus.None,
        this.likesRepo.getNewestLikes(targetId),
      ]);
    return { likesCount, dislikesCount, myStatus, newestLikes };
  }
}
