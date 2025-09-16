import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenPayload } from '../../../modules/sessions/dto/refresh-token.interface';
import type { Request } from 'express';

interface RequestWithDevice extends Request {
  deviceInfo?: RefreshTokenPayload;
}
export const CurrentDevice = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RefreshTokenPayload => {
    const req = context.switchToHttp().getRequest<RequestWithDevice>();

    if (!req.deviceInfo) {
      throw new UnauthorizedException(
        'There is no deviceInfo in the request object!',
      );
    }
    return req.deviceInfo;
  },
);
