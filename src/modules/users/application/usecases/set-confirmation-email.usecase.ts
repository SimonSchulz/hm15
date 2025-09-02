import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UserDocument } from '../../infrastructure/schemas/user.schema';

export class SetConfirmationEmailCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(SetConfirmationEmailCommand)
export class SetConfirmationEmailHandler
  implements ICommandHandler<SetConfirmationEmailCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: SetConfirmationEmailCommand): Promise<boolean> {
    const { confirmationCode } = command;

    const user = (await this.usersRepository.findByConfirmationCode(
      confirmationCode,
    )) as UserDocument;
    if (!user || user.emailConfirmation.isConfirmed) {
      return false;
    }

    const recovery = user.emailConfirmation;
    if (
      confirmationCode !== recovery.confirmationCode ||
      (recovery.expirationDate && recovery.expirationDate < new Date())
    ) {
      return false;
    }

    user.setEmailConfirmation();
    await user.save();
    return true;
  }
}
