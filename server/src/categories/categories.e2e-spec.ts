import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CategoriesModule } from './categories.module';
import * as request from 'supertest';
import { PrismaService } from '../shared/prisma.service';
import { AuthModule } from '../auth/auth.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let accessToken: string;
  const testUser = {
    username: 'testusercategories',
    email: 'testusercategories@testusercategories.com',
    password: 'testusercategories',
    avatar: 'testusercategories',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, AuthModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    server = app.getHttpServer();

    const res = await request(server).post('/auth/register').send(testUser);
    accessToken = res.body.accessToken;
  });

  it('should create a new category. PATH: `/categories/create` POST', async () => {
    const { body } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    expect(body.category).toHaveProperty('id');
    expect(body.category.name).toBe('test');
  });

  it('should get all categories. PATH: `/categories` GET', async () => {
    await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body } = await request(server).get('/categories').expect(200);

    expect(body.categories.length).toBe(1);
    expect(body.categories[0].name).toBe('test');
  });

  it('should get a category by id. PATH: `/categories/[:id]` GET', async () => {
    const { body: newCate } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body: data } = await request(server)
      .get(`/categories/${newCate.category.id}`)
      .expect(200);

    expect(data.category.name).toBe('test');
  });

  it('should update a category. PATH: `/categories/[:id]/update` PUT', async () => {
    const { body: newCate } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body: updatedCategory } = await request(server)
      .put(`/categories/${newCate.category.id}/update`)
      .send({
        name: 'test2',
      })
      .set('x-access-token', accessToken)
      .expect(200);

    expect(updatedCategory.category.name).toBe('test2');
  });

  it('should delete a category. PATH: `/categories/[:id]/delete` DELETE', async () => {
    const { body: newCate } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body: category } = await request(server)
      .delete(`/categories/${newCate.category.id}/delete`)
      .set('x-access-token', accessToken)
      .expect(200);

    expect(category.category.deletedCategoryId).toBe(newCate.category.id);
    expect(category.category.deleted).toBe(true);
  });

  it('should not create a category with an unauthenticated request. PATH: `/categories/create` POST', async () => {
    const { body } = await request(server)
      .post('/categories/create')
      .send({
        name: 'this category will not be created',
      })
      .expect(401);

    expect(body.errors).toBeDefined();
  });

  it('should not update a category with an unauthenticated request. PATH: `/categories/[:id]/update` PUT', async () => {
    const { body: createdCategory } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body } = await request(server)
      .put(`/categories/${createdCategory.category.id}/update`)
      .send({
        name: 'this category will not be updated',
      })
      .expect(401);

    expect(body.errors).toBeDefined();
  });

  it('should not delete a category with an unauthenticated request. PATH: `/categories/[:id]/delete` DELETE', async () => {
    const { body: createdCategory } = await request(server)
      .post('/categories/create')
      .send({
        name: 'test',
      })
      .set('x-access-token', accessToken)
      .expect(201);

    const { body } = await request(server)
      .delete(`/categories/${createdCategory.category.id}/delete`)
      .expect(401);

    expect(body.errors).toBeDefined();
  });

  it('should not create a category if a malformed body was passed', async () => {
    const { body } = await request(server)
      .post('/categories/create')
      .send({
        malformed: 'yes',
      })
      .set('x-access-token', accessToken)
      .expect(400);

    expect(body.errors).toBeDefined();
    expect(body.errors[0].message).toBe('"name" is required');
    expect(body.errors[0].field).toBe('name');
  });

  afterEach(async () => {
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
