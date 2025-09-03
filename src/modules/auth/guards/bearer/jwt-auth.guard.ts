import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = RequestDataEntity>(err: any, user: TUser) {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
