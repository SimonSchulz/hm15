import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BloggerPlatformConfig } from '../../../config/blogger-platform.config';

export class LogoutCommand implements ICommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, string> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: BloggerPlatformConfig,
  ) {}

  async execute(command: LogoutCommand) {
    const { refreshToken } = command;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: { deviceId: string; userId: string; iat: number };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token provided');
    }
    return payload.deviceId;
  }
}
