import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<CommentModel>;

@Schema({ collection: 'comments' })
export class CommentModel {
  @Prop({ required: true })
  content!: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
  })
  commentatorInfo!: {
    userId: string;
    userLogin: string;
  };

  @Prop({ required: true })
  postId!: string;

  @Prop({ required: true, default: () => new Date().toISOString() })
  createdAt!: string;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
