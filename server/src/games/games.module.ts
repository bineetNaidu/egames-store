import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { JwtModule } from '@nestjs/jwt';
import { IsAuthenticatedMiddleware } from '../shared/is-authenticated.middleware';
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
  controllers: [GamesController],
  providers: [GamesService, PrismaService],
})
export class GamesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes(
      {
        path: '/games/create',
        method: RequestMethod.POST,
      },
      {
        path: '/games/:id/delete',
        method: RequestMethod.DELETE,
      },
      {
        path: '/games/:id/update',
        method: RequestMethod.PUT,
      },
    );
  }
}
