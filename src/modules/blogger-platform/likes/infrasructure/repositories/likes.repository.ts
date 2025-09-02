import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeModel, LikesDocument } from '../schemas/likes.schema';
import { LikeStatus } from '../../dto/likes.type';
import { NewestLike } from '../../dto/newest-likes.type';
import { UserModel } from '../../../../users/infrastructure/schemas/user.schema';
import { User } from '../../../../users/domain/entities/user.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(LikeModel.name)
    private readonly likesModel: Model<LikesDocument>,
    @InjectModel(UserModel.name) private readonly userModel: Model<User>,
  ) {}

  async getUserStatus(userId: string, targetId: string): Promise<LikeStatus> {
    const like = await this.likesModel
      .findOne({ userId, targetId })
      .lean<LikesDocument | null>();

    return like?.status ?? LikeStatus.None;
  }

  async setUserStatus(
    userId: string,
    targetId: string,
    status: LikeStatus,
  ): Promise<void> {
    await this.likesModel.updateOne(
      { userId, targetId },
      {
        $set: {
          status,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  async countLikes(targetId: string, status: LikeStatus): Promise<number> {
    return this.likesModel.countDocuments({
      targetId,
      status,
    });
  }

  async getNewestLikes(targetId: string): Promise<NewestLike[]> {
    const likes = await this.likesModel
      .find({ targetId, status: LikeStatus.Like })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean<LikesDocument[]>();

    const userIds = likes.map((like) => like.userId);

    const users = await this.userModel
      .find({ _id: { $in: userIds } })
      .select('login')
      .lean();

    return likes.map((like) => {
      const user = users.find((u) => u?._id.toString() === like.userId);
      return {
        addedAt: like.createdAt.toISOString(),
        userId: like.userId,
        login: user?.login ?? 'unknown',
      };
    });
  }
}
