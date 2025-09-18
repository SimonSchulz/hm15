import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersQueryRepository } from './infrastructure/repositories/users.query.repository';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './infrastructure/schemas/user.schema';
import { AuthService } from '../auth/application/auth.service';
import { BcryptService } from '../auth/application/bcrypt.service';
import { NodemailerService } from '../auth/application/nodemailer.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { LocalStrategy } from '../auth/guards/local/local.strategy';
import { JwtStrategy } from '../auth/guards/bearer/jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from '../sessions/session.module';
import { PassportModule } from '@nestjs/passport';
import { CreateUserHandler } from './application/usecases/create-user.usecase';
import { DeleteUserHandler } from './application/usecases/delete-user.usecase';
import { SetConfirmationEmailHandler } from './application/usecases/set-confirmation-email.usecase';
import { SetNewPasswordHandler } from './application/usecases/set-new-password.usecase';
import { UpdateConfirmationEmailHandler } from './application/usecases/update-confirmation-email.usecase';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from '../auth/application/refresh-token.service';

const userUseCases = [
  CreateUserHandler,
  DeleteUserHandler,
  SetConfirmationEmailHandler,
  SetNewPasswordHandler,
  UpdateConfirmationEmailHandler,
];

@Module({
  imports: [
    CqrsModule,
    SessionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('AC_TIME'),
        },
      }),
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    ...userUseCases,
    UsersQueryRepository,
    UsersRepository,
    AuthService,
    BcryptService,
    NodemailerService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenService,
  ],
  exports: [
    MongooseModule,
    UsersQueryRepository,
    UsersRepository,
    JwtModule,
    RefreshTokenService,
  ],
})
export class UsersModule {}
