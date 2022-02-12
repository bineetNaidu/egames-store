import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
    AuthModule,
    CategoriesModule,
    GamesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
