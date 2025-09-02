import { UserDocument } from '../infrastructure/schemas/user.schema';

export class UserViewDto {
  id!: string;
  login!: string;
  email!: string;
  createdAt!: string;

  static mapToView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();
    dto.email = user.email;
    dto.login = user.login;
    dto.id = user._id.toString();
    dto.createdAt = user.createdAt;
    return dto;
  }
  static mapToMe(user: UserDocument) {
    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    };
  }
}
