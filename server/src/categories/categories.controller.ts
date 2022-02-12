import {
  Controller,
  HttpCode,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoriesResponseDto,
  CategoryResponseDto,
  DeleteCategoryResponseDto,
} from './dto/categories.response-dto';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<CategoriesResponseDto> {
    return await this.categoriesService.getAllCategories();
  }

  @Post('create')
  @HttpCode(201)
  async createCategory(
    @Body() category: Prisma.CategoryCreateInput,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.createCategory(category);
  }

  @Put(':id/update')
  @HttpCode(200)
  async updateCategory(
    @Body() category: Prisma.CategoryUpdateInput,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.updateCategory(id, category);
  }

  @Delete(':id/delete')
  @HttpCode(200)
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteCategoryResponseDto> {
    return await this.categoriesService.deleteCategory(id);
  }

  @Get(':id')
  async getCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.getCategory(id);
  }
}
