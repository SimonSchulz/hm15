import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BloggerPlatformConfig } from '../../../config/blogger-platform.config';
import { SessionDevicesQueryRepository } from '../../../sessions/infrastructure/repositories/session.query.repository';
import { TokensDto } from '../../dto/tokens-dto';

export class RefreshTokenCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, TokensDto>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionDevicesQueryRepository: SessionDevicesQueryRepository,
    private readonly config: BloggerPlatformConfig,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<TokensDto> {
    const { deviceId } = command;

    if (!deviceId) {
      throw new UnauthorizedException('Device ID is required');
    }

    const session =
      await this.sessionDevicesQueryRepository.findSessionByDeviceId(deviceId);
    if (!session) throw new UnauthorizedException();

    const userId: string = session.userId;

    const newAccessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.config.accessTokenSecret,
        expiresIn: this.config.accessTokenExpireIn,
      },
    );

    const newRefreshToken = await this.jwtService.signAsync(
      { userId, deviceId },
      {
        secret: this.config.refreshTokenSecret,
        expiresIn: this.config.refreshTokenExpireIn,
      },
    );
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
