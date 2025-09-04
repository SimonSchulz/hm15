import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest<TUser = RequestDataEntity>(err: any, user: TUser) {
    if (err || !user) {
      return undefined;
    } else {
      return user;
    }
  }
}
