import { LikeStatus } from '../../dto/likes.type';

export class GetLikesInfoCommand {
  constructor(
    public readonly targetId: string,
    public readonly userId?: string,
  ) {}
}

export class GetExtendedLikesInfoCommand {
  constructor(
    public readonly targetId: string,
    public readonly userId?: string,
  ) {}
}

export class UpdateLikeStatusCommand {
  constructor(
    public readonly userId: string,
    public readonly targetId: string,
    public readonly newStatus: LikeStatus,
  ) {}
}
