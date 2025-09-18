import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionDevicesQueryRepository } from '../../../sessions/infrastructure/repositories/session.query.repository';
import { RefreshTokenService } from '../../application/refresh-token.service';
import { RequestWithDevice } from '../../../../core/decorators/transform/extract-device-from-token';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionDevicesQueryRepo: SessionDevicesQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithDevice>();
    const cookies = req.cookies as { refreshToken?: string } | undefined;
    const token = cookies?.refreshToken;

    if (!token) throw new UnauthorizedException('Refresh token missing');

    try {
      const payload = this.refreshTokenService.verify(token);
      const session = await this.sessionDevicesQueryRepo.findSessionByDeviceId(
        payload.deviceId,
      );
      if (!session) throw new UnauthorizedException();

      const tokenIssuedAt = new Date(payload.iat * 1000).getTime();
      const sessionCreatedAt = new Date(session.lastActiveDate).getTime();

      if (tokenIssuedAt < sessionCreatedAt) {
        throw new UnauthorizedException('Stale or reused refresh token');
      }

      req.deviceInfo = {
        userId: payload.userId,
        deviceId: payload.deviceId,
        iat: payload.iat,
        exp: payload.exp,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
