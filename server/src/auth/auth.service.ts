import { verify, hash } from 'argon2';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { User, Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(data: LoginDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          errors: [
            {
              field: 'email',
              message: 'User not found',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = await verify(user.password, data.password);

    if (!isValid) {
      throw new UnauthorizedException({
        errors: [
          {
            field: 'password',
            message: 'Invalid password',
          },
        ],
      });
    }

    return user;
  }

  async register(data: Prisma.UserCreateInput): Promise<User> {
    const isExistingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            username: data.username,
          },
        ],
      },
    });
    if (isExistingUser) {
      throw new HttpException(
        {
          errors: [
            {
              field: 'username',
              message: 'Username or email already exists',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await hash(data.password, { hashLength: 12 });

    const user = await this.prisma.user.create({
      data: {
        avatar: data.avatar,
        email: data.email,
        username: data.username,
        password: hashPassword,
      },
    });

    return user;
  }
}
