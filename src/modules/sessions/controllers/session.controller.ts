import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Request } from 'express';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RefreshTokenGuard } from '../../auth/guards/bearer/refresh.guard';
import { GetAllSessionsQuery } from '../application/query/get-all-sessions.usecase';
import { DeleteOtherSessionsCommand } from '../application/session-usecases/delete-other-sessions.usecase';
import { GetSessionByDeviceQuery } from '../application/query/get-session-by-device.usecase';
import { DeleteSessionByDeviceCommand } from '../application/session-usecases/delete-session.usecase';
import { RefreshTokenPayload } from '../dto/refresh-token.interface';
import { SessionDevice } from '../infrastructure/schemas/session-device.schema';
@Controller('security/devices')
@UseGuards(RefreshTokenGuard)
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllSessions(@Req() req: Request) {
    const payload = req.user as RefreshTokenPayload;
    const sessions: SessionDevice[] = await this.queryBus.execute(
      new GetAllSessionsQuery(payload.userId),
    );
    return sessions.map((s: SessionDevice) => ({
      ip: s.ip,
      title: s.title,
      lastActiveDate: s.lastActiveDate,
      deviceId: s.deviceId,
    }));
  }

  @Delete()
  @HttpCode(204)
  async deleteOtherSessions(@Req() req: Request) {
    const payload = req.user as RefreshTokenPayload;
    await this.commandBus.execute(
      new DeleteOtherSessionsCommand(payload.userId, payload.deviceId),
    );
  }

  @Delete(':deviceId')
  @HttpCode(204)
  async deleteByDeviceId(
    @Req() req: Request,
    @Param('deviceId') deviceId: string,
  ) {
    const payload = req.user as RefreshTokenPayload;

    const session: SessionDevice | null = await this.queryBus.execute(
      new GetSessionByDeviceQuery(deviceId),
    );
    if (!session) throw new NotFoundException('Session not found');

    if (session.userId !== payload.userId) {
      throw new ForbiddenException('Cannot delete session of another user');
    }

    await this.commandBus.execute(new DeleteSessionByDeviceCommand(deviceId));
  }
}
