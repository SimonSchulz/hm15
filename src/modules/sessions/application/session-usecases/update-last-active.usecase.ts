import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesRepository } from '../../infrastructure/repositories/session.repository';

export class UpdateLastActiveDateCommand implements ICommand {
  constructor(
    public readonly deviceId: string,
    public readonly iat: string,
  ) {}
}

@CommandHandler(UpdateLastActiveDateCommand)
@Injectable()
export class UpdateLastActiveDateHandler
  implements ICommandHandler<UpdateLastActiveDateCommand>
{
  constructor(private readonly repository: SessionDevicesRepository) {}

  async execute(command: UpdateLastActiveDateCommand): Promise<void> {
    return this.repository.updateLastActiveDate(command.deviceId, command.iat);
  }
}
