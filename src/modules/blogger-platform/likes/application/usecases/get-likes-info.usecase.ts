import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetLikesInfoCommand } from '../commands/likes.commands';
import { LikesInfo } from '../../dto/likes-info.dto';
import { LikesRepository } from '../../infrasructure/repositories/likes.repository';
import { LikeStatus } from '../../dto/likes.type';

@CommandHandler(GetLikesInfoCommand)
export class GetLikesInfoHandler
  implements ICommandHandler<GetLikesInfoCommand, LikesInfo>
{
  constructor(private readonly likesRepo: LikesRepository) {}

  async execute(command: GetLikesInfoCommand): Promise<LikesInfo> {
    const { targetId, userId } = command;
    const [likesCount, dislikesCount, myStatus] = await Promise.all([
      this.likesRepo.countLikes(targetId, LikeStatus.Like),
      this.likesRepo.countLikes(targetId, LikeStatus.Dislike),
      userId ? this.likesRepo.getUserStatus(userId, targetId) : LikeStatus.None,
    ]);
    return { likesCount, dislikesCount, myStatus };
  }
}
