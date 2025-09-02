import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesRepository } from '../infrasructure/repositories/likes.repository';
import { LikeStatus } from '../dto/likes.type';
import { LikesInfo } from '../dto/likes-info.dto';
import { ExtendedLikesInfo } from '../dto/extended-likes-info.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/repositories/posts.query.repository';
import { CommentsQueryRepository } from '../../comments/infrastructure/repositories/comments.query.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepo: LikesRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  async getLikesInfo(targetId: string, userId?: string): Promise<LikesInfo> {
    const [likesCount, dislikesCount, myStatus] = await Promise.all([
      this.likesRepo.countLikes(targetId, LikeStatus.Like),
      this.likesRepo.countLikes(targetId, LikeStatus.Dislike),
      userId ? this.likesRepo.getUserStatus(userId, targetId) : LikeStatus.None,
    ]);
    return { likesCount, dislikesCount, myStatus };
  }

  async getExtendedLikesInfo(
    targetId: string,
    userId?: string,
  ): Promise<ExtendedLikesInfo> {
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

  async updateLikeStatus(
    userId: string,
    targetId: string,
    newStatus: LikeStatus,
  ): Promise<void> {
    const comment = await this.commentsQueryRepository.findById(targetId);
    const post = await this.postsQueryRepository.findById(targetId);
    if (!comment && !post) {
      throw new NotFoundException('Incorrect target id');
    }
    const currentStatus = await this.likesRepo.getUserStatus(userId, targetId);
    if (currentStatus === newStatus) return;
    await this.likesRepo.setUserStatus(userId, targetId, newStatus);
  }
}
