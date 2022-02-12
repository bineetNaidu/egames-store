import { Review } from '@prisma/client';

export class ReviewsResponseDto {
  reviews: Review[];
}

export class CreateReviewResponseDto {
  review: Review;
}

export class DeleteReviewResponseDto {
  review: {
    deletedReviewId: number;
    deleted: boolean;
  };
}
