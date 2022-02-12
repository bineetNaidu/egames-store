import { Game } from '@prisma/client';

export class GamesResponseDto {
  games: Game[];
}

export class GameResponseDto {
  game: Game;
}

export class DeleteGameResponseDto {
  game: {
    deletedGameId: number;
    deleted: boolean;
  };
}
