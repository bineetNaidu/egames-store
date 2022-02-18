import { FC, memo } from 'react';
import { Card, Row, Avatar, Text, Col } from '@nextui-org/react';
import { GameReview } from '../lib/types';
import { Rating } from 'react-simple-star-rating';

interface ReviewCardProps {
  review: GameReview;
  clickable?: boolean;
}

export const ReviewCard: FC<ReviewCardProps> = memo(({ review, clickable }) => {
  const rating = review.rating * 20;
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
      </Col>
    </Card>
  );
});

ReviewCard.displayName = 'ReviewCard';
