import argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { User, Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(data: LoginDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return null;
    }

    const isValid = await argon.verify(user.password, data.password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async register(data: Prisma.UserCreateInput): Promise<User> {
    const hash = await argon.hash(data.password, { hashLength: 12 });

    const user = await this.prisma.user.create({
      data: {
        avatar: data.avatar,
        email: data.email,
        username: data.username,
        password: hash,
        reviews: {
          create: [],
        },
        purcahses: {
          create: [],
        },
      },
    });

    return user;
  }
}
