import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { IsAuthenticatedMiddleware } from '../shared/is-authenticated.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretistoohardtoguess',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        path: '/categories/create',
        method: RequestMethod.POST,
      },
      {
        path: '/categories/:id/delete',
        method: RequestMethod.DELETE,
      },
      {
        path: '/categories/:id/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
