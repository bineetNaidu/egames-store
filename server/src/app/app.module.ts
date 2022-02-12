import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [AuthModule, CategoriesModule, GamesModule],
})
export class AppModule {}
