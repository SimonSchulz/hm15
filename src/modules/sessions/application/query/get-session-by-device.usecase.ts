import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesQueryRepository } from '../../infrastructure/repositories/session.query.repository';
import { SessionDevice } from '../../infrastructure/schemas/session-device.schema';

export class GetSessionByDeviceQuery implements IQuery {
  constructor(public readonly deviceId: string) {}
}

@QueryHandler(GetSessionByDeviceQuery)
@Injectable()
export class GetSessionByDeviceHandler
  implements IQueryHandler<GetSessionByDeviceQuery, SessionDevice | null>
{
  constructor(private readonly repository: SessionDevicesQueryRepository) {}

  async execute(query: GetSessionByDeviceQuery) {
    return this.repository.findSessionByDeviceId(query.deviceId);
  }
}
