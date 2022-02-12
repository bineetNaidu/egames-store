import { Category } from '@prisma/client';

export class CategoriesResponseDto {
  categories: Category[];
}

export class CategoryResponseDto {
  category: Category;
}

export class DeleteCategoryResponseDto {
  category: {
    deletedCategoryId: number;
    deleted: boolean;
  };
}
