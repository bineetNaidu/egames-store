import { FC, memo } from 'react';
import { Card, Row, Avatar, Text, Col } from '@nextui-org/react';
import { GameReview } from '../lib/types';
import { Rating } from 'react-simple-star-rating';

interface ReviewCardProps {
  review: GameReview;
}

export const ReviewCard: FC<ReviewCardProps> = memo(({ review }) => {
  return (
    <Card shadow css={{ my: '$5' }}>
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
        <Rating ratingValue={parseInt(review.rating)} transition readonly />

        <Text h5 css={{ fontStyle: 'italic', fontWeight: '$light' }}>
          ~ {review.content}
        </Text>
      </Col>
    </Card>
  );
});

ReviewCard.displayName = 'ReviewCard';
