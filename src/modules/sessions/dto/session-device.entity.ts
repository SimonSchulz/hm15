export class SessionDeviceEntity {
  constructor(
    public userId: string,
    public deviceId: string,
    public ip: string,
    public title: string,
    public lastActiveDate: Date,
  ) {}
}
