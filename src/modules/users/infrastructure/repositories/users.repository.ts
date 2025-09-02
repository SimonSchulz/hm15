import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from '../schemas/user.schema';
import { User } from '../../domain/entities/user.entity';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}
  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async findByRecoveryCode(recoveryCode: string) {
    return this.userModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    });
  }
  async findByConfirmationCode(code: string) {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async create(user: User): Promise<string> {
    const created = await this.userModel.create(user);
    return created._id.toString();
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount < 1) {
      throw new NotFoundException('user not exist');
    }
    return !!result;
  }
}
