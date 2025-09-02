import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UserDocument } from '../../infrastructure/schemas/user.schema';

export class SetNewPasswordCommand {
  constructor(
    public readonly passwordHash: string,
    public readonly recoveryCode: string,
  ) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordHandler
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: SetNewPasswordCommand): Promise<boolean> {
    const { passwordHash, recoveryCode } = command;

    const user = (await this.usersRepository.findByRecoveryCode(
      recoveryCode,
    )) as UserDocument;
    if (!user) return false;

    const recovery = user.passwordRecovery;
    if (recovery.expirationDate && recovery.expirationDate < new Date()) {
      return false;
    }

    user.setPassword(passwordHash);
    await user.save();
    return true;
  }
}
