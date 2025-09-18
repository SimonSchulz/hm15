import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SessionDevice,
  SessionDeviceDocument,
} from '../schemas/session-device.schema';
import { SessionDeviceEntity } from '../../dto/session-device.entity';

@Injectable()
export class SessionDevicesRepository {
  constructor(
    @InjectModel(SessionDevice.name)
    private readonly sessionDeviceModel: Model<SessionDeviceDocument>,
  ) {}

  async create(
    sessionDevice: SessionDeviceEntity,
  ): Promise<SessionDeviceEntity> {
    const created = new this.sessionDeviceModel(sessionDevice);
    await created.save();
    return new SessionDeviceEntity(
      created.userId,
      created.deviceId,
      created.ip,
      created.title,
      created.lastActiveDate,
    );
  }

  async updateLastActiveDate(deviceId: string, iat: Date): Promise<void> {
    await this.sessionDeviceModel.updateOne(
      { deviceId },
      { $set: { lastActiveDate: iat } },
    );
  }

  async deleteAllExcept(userId: string, deviceId: string): Promise<void> {
    await this.sessionDeviceModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    const result = await this.sessionDeviceModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  }
}
