import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [AuthModule, CategoriesModule, GamesModule, ReviewsModule],
})
export class AppModule {}
