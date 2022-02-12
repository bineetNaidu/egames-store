import { Prisma } from '@prisma/client';

type BaseCreateGameDto = Pick<
  Prisma.GameCreateInput,
  | 'name'
  | 'details'
  | 'game_size'
  | 'info'
  | 'price'
  | 'thumbnail'
  | 'images'
  | 'tags'
  | 'is_available'
> & {
  category_id?: number;
  category?: {
    name: string;
  };
};

export interface CreateGameDto {
  data: BaseCreateGameDto;
}
