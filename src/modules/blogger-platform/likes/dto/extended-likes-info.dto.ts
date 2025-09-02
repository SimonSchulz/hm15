import { LikeStatus } from './likes.type';
import { NewestLike } from './newest-likes.type';

export class ExtendedLikesInfo {
  likesCount: number = 0;
  dislikesCount: number = 0;
  myStatus: LikeStatus = LikeStatus.None;
  newestLikes: NewestLike[] = [];
  static defaultValues() {
    return new ExtendedLikesInfo();
  }

  static setValue(
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: NewestLike[],
  ) {
    const dto = new ExtendedLikesInfo();
    dto.likesCount = likesCount;
    dto.dislikesCount = dislikesCount;
    dto.myStatus = myStatus;
    dto.newestLikes = newestLikes;
    return dto;
  }
}
