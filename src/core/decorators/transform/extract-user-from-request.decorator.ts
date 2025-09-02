import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestDataEntity } from '../../dto/request.data.entity';

export interface RequestWithUser extends Request {
  user?: RequestDataEntity;
}

export const ExtractUserFromRequest = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestDataEntity => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new UnauthorizedException(
        'There is no user in the request object!',
      );
    }

    return request.user;
  },
);
