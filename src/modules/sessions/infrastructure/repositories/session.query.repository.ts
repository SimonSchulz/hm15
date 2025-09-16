import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SessionDevice,
  SessionDeviceDocument,
} from '../schemas/session-device.schema';

@Injectable()
export class SessionDevicesQueryRepository {
  constructor(
    @InjectModel(SessionDevice.name)
    private readonly sessionDeviceModel: Model<SessionDeviceDocument>,
  ) {}

  async findAllByUserId(userId: string): Promise<SessionDevice[]> {
    return this.sessionDeviceModel.find({ userId }).exec();
  }

  async findSessionByDeviceId(deviceId: string): Promise<SessionDevice | null> {
    return this.sessionDeviceModel.findOne({ deviceId }).exec();
  }
}
