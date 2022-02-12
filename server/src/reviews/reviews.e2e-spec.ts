import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../shared/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ReviewsModule } from './reviews.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let accessToken: string;
  const testUser = {
    username: 'testusergamesreviews',
    email: 'testusergamesreviews@testusergamesreviews.com',
    password: 'testusergamesreviews',
    avatar: 'testusergamesreviews',
  };
  const testReview = {
    content: 'test content',
    rating: 5,
  };

  async function createGame() {
    const game = await prisma.game.create({
      data: {
        name: 'testgamereviews',
        thumbnail: 'test thumbnail',
        details: 'testgamereviews details',
        info: 'testgamereviews info',
        images: ['testgamereviews image'],
        price: 10,
        tags: ['testgamereviews tag'],
        game_size: '1.6gb',
        category: {
          create: {
            name: 'testgamereviews category',
          },
        },
      },
    });

    return game.id;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ReviewsModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    server = app.getHttpServer();

    const authRes = await request(server).post('/auth/register').send(testUser);
    accessToken = authRes.body.accessToken;
  });

  it('should create a new games. PATH: `/games/[:id]/reviews/create` POST', async () => {
    const gameId = await createGame();

    const res = await request(server)
      .post(`/games/${gameId}/reviews/create`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(201);

    expect(res.body.review).toBeDefined();
    expect(res.body.review.content).toBe('test content');
    expect(res.body.review.rating).toBe(5);
    expect(res.body.review.game_id).toBe(gameId);
  });

  it('should delete a review. PATH: `/games/[:id]/reviews/[:reviewId]/delete` DELETE', async () => {
    const gameId = await createGame();

    const res = await request(server)
      .post(`/games/${gameId}/reviews/create`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(201);

    const reviewId = res.body.review.id;

    const deleteRes = await request(server)
      .delete(`/games/${gameId}/reviews/${reviewId}/delete`)
      .set('x-access-token', accessToken)
      .expect(200);

    expect(deleteRes.body.review.deletedReviewId).toBe(reviewId);
    expect(deleteRes.body.review.deleted).toBe(true);
  });

  it('should get all reviews for a games. PATH: `/games/[:id]/reviews/` GET', async () => {
    const gameId = await createGame();

    const res = await request(server)
      .post(`/games/${gameId}/reviews/create`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(201);

    const reviewId = res.body.review.id;

    const getRes = await request(server)
      .get(`/games/${gameId}/reviews`)
      .set('x-access-token', accessToken)
      .expect(200);

    expect(getRes.body.reviews).toBeDefined();
    expect(getRes.body.reviews[0].id).toBe(reviewId);
    expect(getRes.body.reviews[0].content).toBe('test content');
    expect(getRes.body.reviews[0].rating).toBe(5);
    expect(getRes.body.reviews[0].game_id).toBe(gameId);
  });

  it('should not delete a review on unauthenticated request. PATH: `/games/[:id]/reviews/[:reviewId]/delete` DELETE', async () => {
    const gameId = await createGame();

    const res = await request(server)
      .post(`/games/${gameId}/reviews/create`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(201);

    const reviewId = res.body.review.id;

    const deleteRes = await request(server)
      .delete(`/games/${gameId}/reviews/${reviewId}/delete`)
      .expect(401);

    expect(deleteRes.body.errors).toBeDefined();
  });

  it('should not create a review on unauthenticated request. PATH: `/games/[:id]/reviews/create` POST', async () => {
    const gameId = await createGame();

    const res = await request(server)
      .post(`/games/${gameId}/reviews/create`)
      .send(testReview)
      .expect(401);

    expect(res.body.errors).toBeDefined();
  });

  it('should not create a review on a game ID which dont exist. PATH: `/games/[:id]/reviews/create` GET', async () => {
    const res = await request(server)
      .post(`/games/${123}/reviews/create`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(404);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe('Game not found');
  });

  it('should not delete a review on a game ID which dont exist. PATH: `/games/[:id]/reviews/[:reviewId]` DELETE', async () => {
    const res = await request(server)
      .delete(`/games/${123}/reviews/123/delete`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(404);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe('Game with id 123 was not found');
  });

  it('should not delete a review on a review ID which dont exist. PATH: `/games/[:id]/reviews/[:reviewId]` DELETE', async () => {
    const gameId = await createGame();
    const res = await request(server)
      .delete(`/games/${gameId}/reviews/123/delete`)
      .set('x-access-token', accessToken)
      .send(testReview)
      .expect(404);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe('Review with id 123 was not found');
  });

  afterEach(async () => {
    await prisma.review.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
