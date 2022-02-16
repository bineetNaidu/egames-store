// ---- UTILS ----
type Base = {
  id: number;
  created_at: string;
  updated_at: string;
};

export type User = {
  username: string;
  email: string;
  avatar: string;
  role: string;
} & Base;

export type Category = {
  name: string;
} & Base;

export type Game = {
  name: string;
  thumbnail: string;
  info: string;
  details: string;
  images: string;
  tags: string;
  price: string;
  is_available: string;
  category?: Pick<Category, 'id' | 'name'>;
  category_id?: number;
  game_size: string;
  reviews: GameReview[];
} & Base;

export type GameReview = {
  content: string;
  rating: string;
  user?: Pick<User, 'id' | 'username' | 'avatar'>;
  user_id?: number;
  game?: Pick<Game, 'id' | 'name' | 'thumbnail'>;
  game_id?: number;
} & Base;

export type ApiError = {
  field: string;
  message: string;
};

interface IResponse {
  errors?: ApiError[];
}

// ---- AUTH ----

export interface IAuthResponse extends IResponse {
  user?: User;
  accessToken?: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

type RegisterRequiredFields = Pick<User, 'username' | 'email' | 'avatar'>;

export interface IRegisterBody extends RegisterRequiredFields {
  password: string;
}

// ---- GAME ----
type CreateGameRequiredFields = Pick<
  Game,
  | 'name'
  | 'thumbnail'
  | 'info'
  | 'details'
  | 'images'
  | 'tags'
  | 'price'
  | 'is_available'
  | 'game_size'
>;

export interface ICreateGameBody extends CreateGameRequiredFields {
  category_id?: number;
  category?: {
    name: string;
  };
}

export interface IUpdateGameBody extends Partial<CreateGameRequiredFields> {}

export interface IGetGameResponse extends IResponse {
  game?: Game;
}

export interface IGamesResponse extends IResponse {
  games: Game[];
}

export interface ICategoriesResponse extends IResponse {
  categories: Category[];
}

// ---- REVIEW ----
type CreateReviewRequiredFields = Pick<GameReview, 'content' | 'rating'>;

export interface ICreateReviewBody extends CreateReviewRequiredFields {}

export interface IUpdateReviewBody
  extends Partial<CreateReviewRequiredFields> {}

export interface IGetReviewResponse extends IResponse {
  reviews: GameReview[];
}
