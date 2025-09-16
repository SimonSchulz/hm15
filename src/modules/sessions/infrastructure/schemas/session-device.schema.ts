import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDeviceDocument = HydratedDocument<SessionDevice>;

@Schema({ collection: 'SessionDevices' })
export class SessionDevice {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  deviceId!: string;

  @Prop({ required: true })
  ip!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  lastActiveDate!: Date;
}

export const SessionDeviceSchema = SchemaFactory.createForClass(SessionDevice);
