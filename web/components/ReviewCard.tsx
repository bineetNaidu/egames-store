import { FC, memo } from 'react';
import { Card, Row, Avatar, Text, Col, Button } from '@nextui-org/react';
import { GameReview } from '../lib/types';
import { Rating } from 'react-simple-star-rating';
import { useUserStore } from '../lib/store/user.store';
import { Delete } from 'react-iconly';

interface ReviewCardProps {
  handleDeleteReview: (id: number) => Promise<void>;
  review: GameReview;
  clickable?: boolean;
}

export const ReviewCard: FC<ReviewCardProps> = memo(
  ({ review, clickable, handleDeleteReview }) => {
    const rating = review.rating * 20;
    const { authUser } = useUserStore();

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
              onClick={() => handleDeleteReview(review.id)}
            />
          )}
        </Col>
      </Card>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';
