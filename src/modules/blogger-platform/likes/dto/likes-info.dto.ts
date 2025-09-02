import { LikeStatus } from './likes.type';

export class LikesInfo {
  likesCount: number = 0;
  dislikesCount: number = 0;
  myStatus: LikeStatus = LikeStatus.None;

  static defaultValues() {
    return new LikesInfo();
  }

  static setValue(
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
  ) {
    const dto = new LikesInfo();
    dto.likesCount = likesCount;
    dto.dislikesCount = dislikesCount;
    dto.myStatus = myStatus;
    return dto;
  }
}
