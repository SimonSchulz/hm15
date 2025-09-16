import type { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionDevicesQueryRepository } from '../../../sessions/infrastructure/repositories/session.query.repository';
import { RefreshTokenPayload } from '../../../sessions/dto/refresh-token.interface';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../refresh.token.module';
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly jwtService: JwtService,
    private readonly sessionDevicesQueryRepo: SessionDevicesQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const cookies = req.cookies as { refreshToken?: string } | undefined;
    const token = cookies?.refreshToken;

    if (!token) throw new UnauthorizedException('Refresh token missing');

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        token,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      const session = await this.sessionDevicesQueryRepo.findSessionByDeviceId(
        payload.deviceId,
      );
      if (!session) throw new UnauthorizedException();

      const tokenIssuedAt = new Date(payload.iat * 1000).getTime();
      const sessionCreatedAt = new Date(session.lastActiveDate).getTime();

      if (tokenIssuedAt !== sessionCreatedAt) {
        throw new UnauthorizedException('Stale or reused refresh token');
      }

      req.user = {
        userId: payload.userId,
        deviceId: payload.deviceId,
        iat: payload.iat,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
