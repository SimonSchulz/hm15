import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  EmailConfirmation,
  EmailConfirmationSchema,
} from './email-confirmation.schema';
import { PasswordRecovery } from './password-recovery.schema';
import { randomUUID } from 'crypto';
export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: 'users' })
export class UserModel {
  @Prop({ required: true })
  login!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  createdAt: string = new Date().toISOString();

  @Prop({ required: true, type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation = {
    confirmationCode: '',
    expirationDate: null,
    isConfirmed: false,
  };

  @Prop({ required: true })
  passwordRecovery: PasswordRecovery = {
    recoveryCode: '',
    expirationDate: new Date(),
  };
  setEmailConfirmationCode() {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.expirationDate = expiration;
  }
  setEmailConfirmation() {
    this.emailConfirmation.isConfirmed = true;
  }

  setPassword(newPassword: string) {
    this.passwordHash = newPassword;
  }

  setRecoveryCode() {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);
    this.passwordRecovery.recoveryCode = randomUUID();
    this.passwordRecovery.expirationDate = expiration;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
// UserSchema.methods.setEmailConfirmationCode = function (this: UserDocument) {
//   const expiration = new Date();
//   expiration.setMinutes(expiration.getMinutes() + 10);
//   this.emailConfirmation.confirmationCode = randomUUID();
//   this.emailConfirmation.expirationDate = expiration;
// };
//
// UserSchema.methods.setEmailConfirmed = function (this: UserDocument) {
//   this.emailConfirmation.isConfirmed = true;
// };
//
// UserSchema.methods.setPassword = function (newPassword: string) {
//   this.passwordHash = newPassword;
// };
//
// UserSchema.methods.setRecoveryCode = function (this: UserDocument) {
//   const expiration = new Date();
//   expiration.setMinutes(expiration.getMinutes() + 10);
//   this.passwordRecovery.recoveryCode = randomUUID();
//   this.passwordRecovery.expirationDate = expiration;
// };
UserSchema.loadClass(UserModel);
