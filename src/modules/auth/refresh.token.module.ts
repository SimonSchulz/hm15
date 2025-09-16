import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const REFRESH_TOKEN_STRATEGY_INJECT_TOKEN = Symbol(
  'REFRESH_TOKEN_STRATEGY_INJECT_TOKEN',
);
@Global()
@Module({})
export class RefreshTokenModule {
  static forRoot(): DynamicModule {
    return {
      module: RefreshTokenModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        {
          provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
          useFactory: (configService: ConfigService) => {
            return new JwtService({
              secret: configService.get<string>('REFRESH_TOKEN_SECRET'),
              signOptions: { expiresIn: configService.get<string>('RF_TIME') },
            });
          },
          inject: [ConfigService],
        },
      ],
      exports: [REFRESH_TOKEN_STRATEGY_INJECT_TOKEN],
    };
  }
}
