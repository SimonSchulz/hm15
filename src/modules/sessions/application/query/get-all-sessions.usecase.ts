import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { SessionDevicesQueryRepository } from '../../infrastructure/repositories/session.query.repository';
import { SessionDevice } from '../../infrastructure/schemas/session-device.schema';

export class GetAllSessionsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetAllSessionsQuery)
@Injectable()
export class GetAllSessionsHandler
  implements IQueryHandler<GetAllSessionsQuery, SessionDevice[]>
{
  constructor(private readonly repository: SessionDevicesQueryRepository) {}

  async execute(query: GetAllSessionsQuery) {
    return this.repository.findAllByUserId(query.userId);
  }
}
