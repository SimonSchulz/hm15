import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<BlogModel>;

@Schema({ collection: 'blogs' })
export class BlogModel {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  websiteUrl!: string;

  @Prop({ required: true })
  isMembership!: boolean;

  @Prop({ required: true })
  createdAt!: string;
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
