import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmailConfirmation {
  @Prop({ required: true, default: '' })
  confirmationCode: string = '';

  @Prop({ required: true, type: Date, default: null })
  expirationDate: Date | null = null;

  @Prop({ required: true, default: false })
  isConfirmed: boolean = false;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
