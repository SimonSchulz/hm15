import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { NodemailerService } from './nodemailer.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query.repository';
import { JwtService } from '@nestjs/jwt';
import { emailExamples } from '../domain/tamplates/email-confirmation-message';
import { RegistrationInputDto } from '../dto/registration-input.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SetNewPasswordCommand } from '../../users/application/usecases/set-new-password.usecase';
import { SetConfirmationEmailCommand } from '../../users/application/usecases/set-confirmation-email.usecase';
import { UpdateConfirmationEmailCommand } from '../../users/application/usecases/update-confirmation-email.usecase';
import { CreateUserCommand } from '../../users/application/usecases/create-user.usecase';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../users/constants/auth-tokens.inject-constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly bcryptService: BcryptService,
    private readonly nodemailerService: NodemailerService,
    private readonly accessJwtService: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshJwtService: JwtService,
  ) {}
  login(userId: string, userLogin: string) {
    const accessToken = this.accessJwtService.sign({
      userId,
      userLogin,
    });

    const refreshToken = this.refreshJwtService.sign({
      userId,
      userLogin,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async validateUser(loginOrEmail: string, password: string) {
    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isPassValid = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isPassValid) return null;

    return {
      userId: user._id.toString(),
      userLogin: user.login,
    };
  }

  async registerUser(dto: RegistrationInputDto): Promise<string> {
    await this.usersQueryRepository.checkExistByLoginOrEmail(
      dto.login,
      dto.email,
    );
    const id: string = await this.commandBus.execute(
      new CreateUserCommand(dto),
    );
    const user = await this.usersQueryRepository.findByLoginOrEmail(dto.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.nodemailerService.sendEmail(
      user.email,
      user.emailConfirmation.confirmationCode,
      emailExamples.registrationEmail,
    );
    return id;
  }
  async changePassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const passwordHash = await this.bcryptService.generateHash(newPassword);
    return await this.commandBus.execute(
      new SetNewPasswordCommand(passwordHash, recoveryCode),
    );
  }
  async getUserData(id: string) {
    return this.usersQueryRepository.me(id);
  }
  async passwordRecovery(email: string) {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email);
    if (!user) return null;
    user.setRecoveryCode();
    await user.save();
    const recovery = user.passwordRecovery;
    await this.nodemailerService.sendEmail(
      email,
      recovery.recoveryCode,
      emailExamples.registrationEmail,
    );
  }
  async confirmRegistration(code: string) {
    const result: boolean = await this.commandBus.execute(
      new SetConfirmationEmailCommand(code),
    );
    if (!result) {
      throw new BadRequestException(
        'code is invalid or email already confirmed',
      );
    }
  }
  async resendConfirmationEmail(email: string) {
    const code: string = await this.commandBus.execute(
      new UpdateConfirmationEmailCommand(email),
    );
    if (!code) throw new BadRequestException('email not found');
    await this.nodemailerService.sendEmail(
      email,
      code,
      emailExamples.registrationEmail,
    );
  }
}
