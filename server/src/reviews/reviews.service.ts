import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../shared/prisma.service';
import { CreateReviewDto } from './dto/reviews.dto';
import {
  ReviewsResponseDto,
  CreateReviewResponseDto,
  DeleteReviewResponseDto,
} from './dto/reviews.response-dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getAllReviews(gameId: number): Promise<ReviewsResponseDto> {
    const reviews = await this.prisma.review.findMany({
      where: { game: { id: gameId } },
      include: {
        user: true,
        game: true,
      },
    });
    return { reviews };
  }

  async createReview(
    req: Request,
    gameId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResponseDto> {
    const token = req.headers['x-access-token'] as string;
    const payload = this.jwtService.decode(token) as User;
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });
    if (!game) {
      throw new NotFoundException({
        errors: [
          {
            field: 'game',
            message: 'Game not found',
          },
        ],
      });
    }
    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        game: { connect: { id: game.id } },
        user: { connect: { id: payload.id } },
      },
    });
    return { review };
  }

  async deleteReview(
    gameId: number,
    reviewId: number,
  ): Promise<DeleteReviewResponseDto> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });
    if (!game) {
      throw new NotFoundException({
        errors: [
          {
            field: 'gameId',
            message: `Game with id ${gameId} was not found`,
          },
        ],
      });
    }
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException({
        errors: [
          {
            field: 'reviewId',
            message: `Review with id ${reviewId} was not found`,
          },
        ],
      });
    }

    await this.prisma.review.delete({
      where: {
        id: review.id,
      },
    });

    return {
      review: {
        deletedReviewId: review.id,
        deleted: true,
      },
    };
  }
}
