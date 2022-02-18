import { FC, memo, useCallback } from 'react';
import { Card, Row, Avatar, Text, Col, Button } from '@nextui-org/react';
import { GameReview, IDeleteReviewResponse } from '../lib/types';
import { Rating } from 'react-simple-star-rating';
import { useUserStore } from '../lib/store/user.store';
import { Delete } from 'react-iconly';
import { useToasts } from 'react-toast-notifications';
import { useGameReviewStore } from '../lib/store/gameReviews.store';
import { axiosClient } from '../lib/axiosClient';

interface ReviewCardProps {
  review: GameReview;
  clickable?: boolean;
}

export const ReviewCard: FC<ReviewCardProps> = memo(({ review, clickable }) => {
  const rating = review.rating * 20;
  const { authUser } = useUserStore();
  const deleteReview = useGameReviewStore((state) => state.deleteReview);
  const { addToast } = useToasts();

  const handleDeleteReview = useCallback(async () => {
    const { data } = await axiosClient.delete<IDeleteReviewResponse>(
      `/games/${review.game!.id}/reviews/${review.id}/delete`
    );
    if (data.review.deleted && data.review.deletedReviewId === review.id) {
      deleteReview(review.id);
      addToast('Review deleted', {
        appearance: 'success',
        autoDismiss: true,
      });
    } else {
      addToast('Something went wrong', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  }, [addToast, deleteReview, review.game, review.id]);

  return (
    <Card shadow css={{ my: '$5' }} clickable={clickable}>
      <Row align="center">
        <Avatar
          src={review.user?.avatar}
          alt={review.user?.username}
          color="gradient"
          bordered
        />
        <Text css={{ ml: '0.4rem' }}>{review.user?.username}</Text>
      </Row>
      <Col css={{ pl: '2.8rem' }}>
        <Rating ratingValue={rating} readonly />

        <Text h5 css={{ fontStyle: 'italic', fontWeight: '$light' }}>
          ~ {review.content}
        </Text>
        {authUser?.id === review.user_id && (
          <Button
            css={{ mt: '$5' }}
            color="warning"
            size="sm"
            icon={<Delete size="small" filled />}
            auto
            ghost
            onClick={handleDeleteReview}
          />
        )}
      </Col>
    </Card>
  );
});

ReviewCard.displayName = 'ReviewCard';
