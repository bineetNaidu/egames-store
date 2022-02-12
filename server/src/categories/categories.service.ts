import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  DeleteCategoryResponseDto,
} from './dto/categories.response-dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories(): Promise<CategoriesResponseDto> {
    const categories = await this.prisma.category.findMany({
      include: {
        games: true,
      },
    });
    return { categories };
  }

  async createCategory(
    category: Prisma.CategoryCreateInput,
  ): Promise<CategoryResponseDto> {
    if (!category.name) {
      throw new BadRequestException({
        errors: [
          {
            field: 'name',
            message: '"name" is required',
          },
        ],
      });
    }

    const isCategoryNameUnique = await this.prisma.category.findUnique({
      where: {
        name: category.name,
      },
    });

    if (isCategoryNameUnique) {
      throw new ConflictException({
        errors: [
          {
            field: 'name',
            message: 'Category with this name already exists',
          },
        ],
      });
    }

    const createdCategory = await this.prisma.category.create({
      data: category,
    });
    return { category: createdCategory };
  }

  async updateCategory(
    id: number,
    category: Prisma.CategoryUpdateInput,
  ): Promise<CategoryResponseDto> {
    const updatedCategory = await this.prisma.category.update({
      where: {
        id,
      },
      data: category,
      include: {
        games: true,
      },
    });
    return { category: updatedCategory };
  }

  async deleteCategory(id: number): Promise<DeleteCategoryResponseDto> {
    const deletedCategory = await this.prisma.category.delete({
      where: {
        id,
      },
    });
    return {
      category: {
        deletedCategoryId: deletedCategory.id,
        deleted: true,
      },
    };
  }

  async getCategory(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        games: true,
      },
    });
    return { category };
  }
}
