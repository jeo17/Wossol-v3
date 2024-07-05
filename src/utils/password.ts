import { pbkdf2Sync } from 'crypto';
import { getPasswordSalt } from './env';

export function hashPassword(password: string) {
  return pbkdf2Sync(password, getPasswordSalt(), 1000, 64, 'sha512').toString(
    'hex',
  );
}
