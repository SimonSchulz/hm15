import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesRepository } from '../../infrastructure/repositories/session.repository';

export class DeleteSessionByDeviceCommand implements ICommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(DeleteSessionByDeviceCommand)
@Injectable()
export class DeleteSessionByDeviceHandler
  implements ICommandHandler<DeleteSessionByDeviceCommand>
{
  constructor(private readonly repository: SessionDevicesRepository) {}

  async execute(command: DeleteSessionByDeviceCommand): Promise<boolean> {
    return this.repository.deleteByDeviceId(command.deviceId);
  }
}
