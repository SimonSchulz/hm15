import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './extract-user-from-request.decorator';
import { RequestDataEntity } from '../../dto/request.data.entity';

export const ExtractUserIfExistsFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): RequestDataEntity | null => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return null;
    }

    return request.user;
  },
);
