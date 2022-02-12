import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
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
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        path: '/games/:id/reviews/create',
        method: RequestMethod.POST,
      },
      {
        path: '/games/:id/reviews/:reviewId/delete',
        method: RequestMethod.DELETE,
      },
    );
  }
}
