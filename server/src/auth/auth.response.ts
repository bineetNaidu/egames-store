import { User } from '@prisma/client';

export class AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
}
