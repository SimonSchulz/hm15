import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatus } from '../../dto/likes.type';

export type LikesDocument = HydratedDocument<LikeModel>;
@Schema({ collection: 'likes' })
export class LikeModel {
  @Prop({ required: true })
  createdAt!: Date;

  @Prop({ type: String, enum: Object.values(LikeStatus), required: true })
  status!: LikeStatus;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  targetId!: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeModel);
