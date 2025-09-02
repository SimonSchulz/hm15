import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/repositories/users.query.repository';
import { UserDocument } from '../../infrastructure/schemas/user.schema';

export class UpdateConfirmationEmailCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(UpdateConfirmationEmailCommand)
export class UpdateConfirmationEmailHandler
  implements ICommandHandler<UpdateConfirmationEmailCommand, string | false>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(
    command: UpdateConfirmationEmailCommand,
  ): Promise<string | false> {
    const { email } = command;

    const user = (await this.usersQueryRepository.findByLoginOrEmail(
      email,
    )) as UserDocument;
    if (!user) return false;

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('email already confirmed');
    }

    user.setEmailConfirmationCode();
    await user.save();
    return user.emailConfirmation.confirmationCode;
  }
}
