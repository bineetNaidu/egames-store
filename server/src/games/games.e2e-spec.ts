import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GamesModule } from './games.module';
import * as request from 'supertest';
import { PrismaService } from '../shared/prisma.service';
import { AuthModule } from '../auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let accessToken: string;
  const testUser = {
    username: 'testusergames',
    email: 'testusergames@testusergames.com',
    password: 'testusergames',
    avatar: 'testusergames',
  };
  const testGame = {
    name: 'testgame',
    thumbnail: 'test thumbnail',
    details: 'testgame details',
    info: 'testgame info',
    images: ['testgame image'],
    price: 10,
    tags: ['testgame tag'],
    game_size: '1.6gb',
    category: {
      name: 'testcategory',
    },
  };

  async function createGame(authToken: string) {
    const res = await request(server)
      .post('/games/create')
      .send({
        data: testGame,
      })
      .set('x-access-token', authToken)
      .expect(201);

    return res;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, GamesModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    server = app.getHttpServer();

    const authRes = await request(server).post('/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
  });

  it('should create a new games. PATH: `/games/create` POST', async () => {
    const { body } = await createGame(accessToken);
    expect(body.game).toHaveProperty('id');
    expect(body.game.name).toBe(testGame.name);
  });

  it('should get all games. PATH: `/games` GET', async () => {
    await createGame(accessToken);
    const { body } = await request(server).get('/games').expect(200);

    expect(body.games).toHaveLength(1);
    expect(body.games[0].name).toBe(testGame.name);
  });

  it('should get a game by id. PATH: `/games/:id` GET', async () => {
    const { body } = await createGame(accessToken);
    const { body: data } = await request(server)
      .get(`/games/${body.game.id}`)
      .expect(200);

    expect(data.game.name).toBe(testGame.name);
  });

  it('should update a game. PATH: `/games/:id/update` PUT', async () => {
    const { body } = await createGame(accessToken);
    const { body: data } = await request(server)
      .put(`/games/${body.game.id}/update`)
      .send({ data: { name: 'updated game' } })
      .set('x-access-token', accessToken)
      .expect(200);

    expect(data.game.name).toBe('updated game');
  });

  it('should delete a game. PATH: `/games/:id/delete` DELETE', async () => {
    const { body } = await createGame(accessToken);
    const { body: data } = await request(server)
      .delete(`/games/${body.game.id}/delete`)
      .set('x-access-token', accessToken)
      .expect(200);

    expect(data.game.deletedGameId).toBe(body.game.id);
    expect(data.game.deleted).toBe(true);
  });

  it.todo('should get newly created games. PATH: `/games/new_games` GET');

  it('should not create a game on unauthenticated request. PATH: `/games/create` POST', async () => {
    const res = await request(server)
      .post('/games/create')
      .send(testGame)
      .expect(401);
    expect(res.body.errors).toBeDefined();
  });

  it('should not update a game on unauthenticated request. PATH: `/games/:id/update` PUT', async () => {
    const { body } = await createGame(accessToken);
    const res = await request(server)
      .put(`/games/${body.game.id}/update`)
      .send({ name: 'updated game' })
      .expect(401);
    expect(res.body.errors).toBeDefined();
  });

  it('should not delete a game on unauthenticated request. PATH: `/games/:id/delete` DELETE', async () => {
    const { body } = await createGame(accessToken);
    const res = await request(server)
      .delete(`/games/${body.game.id}/delete`)
      .expect(401);
    expect(res.body.errors).toBeDefined();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.category.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
