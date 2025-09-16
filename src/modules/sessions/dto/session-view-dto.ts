import { SessionDeviceEntity } from './session-device.entity';

export class SessionViewDto {
  ip!: string;
  title!: string;
  lastActiveDate!: string;
  deviceId!: string;

  static fromEntity(entity: SessionDeviceEntity): SessionViewDto {
    return {
      ip: entity.ip,
      title: entity.title,
      lastActiveDate: entity.lastActiveDate.toISOString(),
      deviceId: entity.deviceId,
    };
  }
}
