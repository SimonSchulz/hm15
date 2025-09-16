import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesRepository } from '../../infrastructure/repositories/session.repository';

export class DeleteOtherSessionsCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly currentDeviceId: string,
  ) {}
}

@CommandHandler(DeleteOtherSessionsCommand)
@Injectable()
export class DeleteOtherSessionsHandler
  implements ICommandHandler<DeleteOtherSessionsCommand>
{
  constructor(private readonly repository: SessionDevicesRepository) {}

  async execute(command: DeleteOtherSessionsCommand): Promise<void> {
    return this.repository.deleteAllExcept(
      command.userId,
      command.currentDeviceId,
    );
  }
}
