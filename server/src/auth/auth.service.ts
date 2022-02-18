import { verify, hash } from 'argon2';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { Prisma, User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './auth.response';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async profile(req: Request): Promise<Pick<AuthResponse, 'user'>> {
    const token = req.headers['x-access-token'] as string;
    if (!token) {
      return {
        user: null,
      };
    }
    const payload = this.jwtService.decode(token, { json: true });
    const user = await this.prisma.user.findUnique({
      where: {
        id: (payload as User).id,
      },
      rejectOnNotFound: true,
      include: {
        reviews: {
          orderBy: {
            created_at: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            game: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });
    delete user.password;
    return { user };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new NotFoundException({
        errors: [
          {
            field: 'email',
            message: 'The User with this email not found',
          },
        ],
      });
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

    delete user.password;
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
      throw new ConflictException({
        errors: [
          {
            field: 'username',
            message: 'A User with this username or email already exists',
          },
        ],
      });
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

    delete user.password;
    return {
      user,
      accessToken,
    };
  }
}
