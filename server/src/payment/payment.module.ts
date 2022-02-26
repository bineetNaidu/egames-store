import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
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
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAuthenticatedMiddleware).forRoutes({
      path: '/games/:id/purchase',
      method: RequestMethod.POST,
    });
  }
}
