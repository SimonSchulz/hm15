import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RequestDataEntity } from '../../../../core/dto/request.data.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access-token-secret', //TODO: move to env. will be in the following lessons
    });
  }
  validate(payload: RequestDataEntity): RequestDataEntity {
    return payload;
  }
}
