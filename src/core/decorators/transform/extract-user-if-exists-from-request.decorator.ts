import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './extract-user-from-request.decorator';
import { RequestDataEntity } from '../../dto/request.data.entity';

export const ExtractUserIfExistsFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): RequestDataEntity | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user ?? undefined;
  },
);
