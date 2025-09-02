import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import * as process from 'node:process';

@Injectable()
export class BcryptService {
  async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, +process.env.SALT_ROUNDS! || 10);
  }

  checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
