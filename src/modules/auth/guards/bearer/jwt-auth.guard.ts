import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exeptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exeptions/domain-exception-codes';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = RequestDataEntity>(err: any, user: TUser) {
    if (err || !user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
      });
    }
    return user;
  }
}
