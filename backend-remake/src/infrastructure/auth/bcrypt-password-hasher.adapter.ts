import bcrypt from 'bcryptjs';
import type { PasswordHasherPort } from '../../application/auth/ports/password-hasher.port';

export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  private static readonly COST_FACTOR = 12;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, BcryptPasswordHasherAdapter.COST_FACTOR);
  }

  verify(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
