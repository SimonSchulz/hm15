import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionDevicesQueryRepository } from './infrastructure/repositories/session.query.repository';
import { SessionDevicesRepository } from './infrastructure/repositories/session.repository';
import {
  SessionDevice,
  SessionDeviceSchema,
} from './infrastructure/schemas/session-device.schema';
import { GetAllSessionsHandler } from './application/query/get-all-sessions.usecase';
import { GetSessionByDeviceHandler } from './application/query/get-session-by-device.usecase';
import { CreateSessionHandler } from './application/session-usecases/create-session.usecase';
import { DeleteSessionByDeviceHandler } from './application/session-usecases/delete-session.usecase';
import { DeleteOtherSessionsHandler } from './application/session-usecases/delete-other-sessions.usecase';
import { UpdateLastActiveDateHandler } from './application/session-usecases/update-last-active.usecase';
import { SessionsController } from './controllers/session.controller';
import { CqrsModule } from '@nestjs/cqrs';

const sessionUseCases = [
  GetAllSessionsHandler,
  GetSessionByDeviceHandler,
  CreateSessionHandler,
  DeleteSessionByDeviceHandler,
  DeleteOtherSessionsHandler,
  UpdateLastActiveDateHandler,
];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: SessionDevice.name, schema: SessionDeviceSchema },
    ]),
  ],
  providers: [
    ...sessionUseCases,
    SessionDevicesQueryRepository,
    SessionDevicesRepository,
  ],
  controllers: [SessionsController],
  exports: [SessionDevicesQueryRepository, SessionDevicesRepository],
})
export class SessionsModule {}
