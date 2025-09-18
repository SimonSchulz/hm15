import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesRepository } from '../../infrastructure/repositories/session.repository';
import { SessionDeviceEntity } from '../../dto/session-device.entity';

export class CreateSessionCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
    public readonly ip: string,
    public readonly title: string,
    public readonly lastActiveDate: Date,
  ) {}
}

@CommandHandler(CreateSessionCommand)
@Injectable()
export class CreateSessionHandler
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(private readonly repository: SessionDevicesRepository) {}

  async execute(command: CreateSessionCommand): Promise<SessionDeviceEntity> {
    const { userId, deviceId, ip, title, lastActiveDate } = command;
    const session = new SessionDeviceEntity(
      userId,
      deviceId,
      ip,
      title,
      lastActiveDate,
    );
    return this.repository.create(session);
  }
}
