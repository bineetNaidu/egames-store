import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../shared/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { IsAuthenticatedMiddleware } from '../shared/is-authenticated.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretistoohardtoguess',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes({
      path: '/auth/profile',
      method: RequestMethod.GET,
    });
  }
}
