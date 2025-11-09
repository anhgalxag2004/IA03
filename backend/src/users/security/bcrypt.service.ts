import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(data: string): Promise<string> {
    const saltRounds = 10;
    return hash(data, saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
