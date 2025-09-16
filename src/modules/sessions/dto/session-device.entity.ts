export class SessionDeviceEntity {
  public lastActiveDate!: Date;
  constructor(
    public userId: string,
    public deviceId: string,
    public ip: string,
    public title: string,
  ) {
    this.lastActiveDate = new Date();
  }

  static setNewDate(entity: SessionDeviceEntity) {
    entity.lastActiveDate = new Date();
    return entity;
  }
}
