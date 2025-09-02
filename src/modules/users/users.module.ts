import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersQueryRepository } from './infrastructure/repositories/users.query.repository';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './infrastructure/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/application/auth.service';
import { BcryptService } from '../auth/application/bcrypt.service';
import { NodemailerService } from '../auth/application/nodemailer.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { LocalStrategy } from '../auth/guards/local/local.strategy';
import { JwtStrategy } from '../auth/guards/bearer/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from './constants/auth-tokens.inject-constants';
import { CreateUserHandler } from './application/usecases/create-user.usecase';
import { SetConfirmationEmailHandler } from './application/usecases/set-confirmation-email.usecase';
import { SetNewPasswordHandler } from './application/usecases/set-new-password.usecase';
import { UpdateConfirmationEmailHandler } from './application/usecases/update-confirmation-email.usecase';
import { DeleteUserHandler } from './application/usecases/delete-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';

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
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '6m' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    ...userUseCases,
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret',
          signOptions: { expiresIn: '10m' },
        });
      },
      inject: [],
    },
    UsersQueryRepository,
    UsersRepository,
    AuthService,
    BcryptService,
    NodemailerService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [MongooseModule, UsersQueryRepository, UsersRepository],
})
export class UsersModule {}
