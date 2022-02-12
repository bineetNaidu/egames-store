import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  HttpCode,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewResponseDto,
  DeleteReviewResponseDto,
  ReviewsResponseDto,
} from './dto/reviews.response-dto';
import { CreateReviewDto } from './dto/reviews.dto';
import { Request } from 'express';

@Controller('games/:id/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewsResponseDto> {
    return await this.reviewsService.getAllReviews(id);
  }

  @Post('create')
  @HttpCode(201)
  async createReview(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResponseDto> {
    return await this.reviewsService.createReview(req, id, createReviewDto);
  }

  @Delete('/:reviewId/delete')
  @HttpCode(200)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<DeleteReviewResponseDto> {
    return await this.reviewsService.deleteReview(id, reviewId);
  }
}
