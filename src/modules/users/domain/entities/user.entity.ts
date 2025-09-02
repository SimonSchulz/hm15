import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';

export class User {
  login!: string;
  email!: string;
  passwordHash!: string;
  createdAt!: string;
  emailConfirmation!: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
  passwordRecovery!: {
    recoveryCode: string | null;
    expirationDate: string | null;
  };

  static createUser(
    login: string,
    email: string,
    passwordHash: string,
    isAdmin?: boolean,
  ) {
    const user = new User();
    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.createdAt = new Date().toISOString();
    user.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: addMinutes(new Date(), 10).toISOString(),
      isConfirmed: !!isAdmin,
    };
    user.passwordRecovery = {
      recoveryCode: '',
      expirationDate: user.createdAt,
    };
    return user;
  }
}
