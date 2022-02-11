import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { IsAuthenticatedMiddleware } from 'src/shared/is-authenticated.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretistoohardtoguess',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes({
      path: '/auth/profile',
      method: RequestMethod.GET,
    });
  }
}
