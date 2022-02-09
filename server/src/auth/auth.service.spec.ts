import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../shared/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  const defaultUserData = {
    username: 'test',
    email: 'test@test.com',
    password: 'test',
    avatar: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secretistoohardtoguess',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const data = await service.register(defaultUserData);
    expect(data).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.accessToken).toBeDefined();
    expect(data.user.username).toEqual(defaultUserData.username);
    expect(data.user.email).toEqual(defaultUserData.email);
    expect(data.user.password).not.toEqual(defaultUserData.password);
    expect(data.user.id).toBeDefined();
    await prisma.user.delete({ where: { id: data.user.id } });
  });

  it('should throw error on duplicate username', async () => {
    const u = await service.register(defaultUserData);
    const data = service.register(defaultUserData);
    await expect(data).rejects.toThrow(
      new HttpException(
        {
          errors: [
            {
              field: 'username',
              message: 'Username or email already exists',
            },
          ],
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
    await prisma.user.delete({ where: { id: u.user.id } });
  });

  it('should return a user on login', async () => {
    const u = await service.register(defaultUserData);
    const data = await service.login({
      email: defaultUserData.email,
      password: defaultUserData.password,
    });
    expect(data).toBeDefined();
    expect(data.user).toBeDefined();
    expect(data.accessToken).toBeDefined();
    expect(data.user.username).toEqual(defaultUserData.username);
    expect(data.user.email).toEqual(defaultUserData.email);
    expect(data.user.password).not.toEqual(defaultUserData.password);
    expect(data.user.id).toBeDefined();
    await prisma.user.delete({ where: { id: u.user.id } });
  });

  it.todo('should throw error on invalid password in login');
  it.todo('should return authenticated user on me request');
  it.todo('should throw error on invalid email in login');
  it.todo('should set session on login');
  it.todo('should set session on register');
  it.todo('should throw error on unauthenticated request on me');
});
