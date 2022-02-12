import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';
import { PrismaService } from '../shared/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authServer: any;
  let prisma: PrismaService;
  const testUser = {
    username: 'testuserauth',
    email: 'testuserauth@testuserauth.com',
    password: 'testuserauth',
    avatar: 'testuserauth',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // await app.listen(3000);
    prisma = app.get<PrismaService>(PrismaService);
    authServer = app.getHttpServer();
  });

  it('should register a new user. PATH: `/auth/register` POST', async () => {
    const res = await request(authServer)
      .post('/auth/register')
      .send(testUser)
      .expect(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.username).toEqual(testUser.username);
  });

  it('should throw error on duplicate username. PATH: `/auth/register` POST', async () => {
    await request(authServer).post('/auth/register').send(testUser).expect(201);
    const data = await request(authServer)
      .post('/auth/register')
      .send(testUser)
      .expect(409);
    expect(data.body.errors).toBeDefined();
    expect(data.body.errors[0].field).toEqual('username');
    expect(data.body.errors[0].message).toEqual(
      'A User with this username or email already exists',
    );
  });

  it('should login a existing user. PATH: `/auth/login` POST', async () => {
    await request(authServer).post('/auth/register').send(testUser).expect(201);
    const loginRes = await request(authServer)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);
    expect(loginRes.body.user).toBeDefined();
    expect(loginRes.body.accessToken).toBeDefined();
    expect(loginRes.body.user.username).toEqual(testUser.username);
  });

  it('should throw error on invalid password. PATH: `/auth/login` POST', async () => {
    await request(authServer).post('/auth/register').send(testUser).expect(201);
    const data = await request(authServer)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);
    expect(data.body.errors).toBeDefined();
    expect(data.body.errors[0].field).toEqual('password');
    expect(data.body.errors[0].message).toEqual('Invalid password');
  });

  it('should throw error on invalid email. PATH: `/auth/login` POST', async () => {
    const data = await request(authServer)
      .post('/auth/login')
      .send({
        email: 'man@test.com',
        password: 'password',
      })
      .expect(404);

    expect(data.body.errors).toBeDefined();
    expect(data.body.errors[0].field).toEqual('email');
    expect(data.body.errors[0].message).toEqual(
      'The User with this email not found',
    );
  });

  it('should return the logged in user profile. PATH: `/auth/profile` GET', async () => {
    const registerRes = await request(authServer)
      .post('/auth/register')
      .send(testUser)
      .expect(201);
    const profileRes = await request(authServer)
      .get('/auth/profile')
      .set('x-access-token', registerRes.body.accessToken)
      .expect(200);
    expect(profileRes.body.user).toBeDefined();
    expect(profileRes.body.user.username).toEqual(testUser.username);
  });

  it('should return unauthenticated error in user profile route. PATH: `/auth/profile` GET ', async () => {
    const data = await request(authServer)
      .get('/auth/profile')
      .set('x-access-token', '')
      .expect(401);
    expect(data.body.errors).toBeDefined();
    expect(data.body.errors[0].field).toEqual('token');
    expect(data.body.errors[0].message).toEqual('No token provided');
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
