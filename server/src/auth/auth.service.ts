import { verify, hash } from 'argon2';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './auth.response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(data: LoginDto): Promise<AuthResponse> {
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

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
    };
  }

  async register(data: Prisma.UserCreateInput): Promise<AuthResponse> {
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

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
    };
  }
}
