import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail', passwordField: 'password' });
  }
  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<RequestDataEntity> {
    const user: null | RequestDataEntity = await this.authService.validateUser(
      loginOrEmail,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }
    return user;
  }
}
