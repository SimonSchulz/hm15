import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BloggerPlatformConfig } from '../../config/blogger-platform.config';
import { RefreshTokenPayload } from '../../sessions/dto/refresh-token.interface';

@Injectable()
export class RefreshTokenService {
  private readonly jwtService: JwtService;

  constructor(private readonly configService: ConfigService) {
    const bloggerConfig = new BloggerPlatformConfig(configService);
    this.jwtService = new JwtService({
      secret: bloggerConfig.refreshTokenSecret,
      signOptions: { expiresIn: bloggerConfig.refreshTokenExpireIn },
    });
  }

  sign(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): RefreshTokenPayload {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
