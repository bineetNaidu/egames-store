import {
  Card,
  Avatar,
  Row,
  Textarea,
  Col,
  Text,
  Button,
  Loading,
} from '@nextui-org/react';
import { Form, Formik } from 'formik';
import { FC } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useToasts } from 'react-toast-notifications';
import { axiosClient } from '../lib/axiosClient';
import { useGameReviewStore } from '../lib/store/gameReviews.store';
import { useUserStore } from '../lib/store/user.store';
import { ICreateReviewBody, ICreateReviewResponse } from '../lib/types';
import { sleep } from '../lib/utils';

interface AddReviewCardProps {
  gameId: number;
}

export const AddReviewCard: FC<AddReviewCardProps> = ({ gameId }) => {
  const { authUser, isAuthenticated } = useUserStore();
  const addReview = useGameReviewStore((state) => state.addReview);
  const { addToast } = useToasts();

  if (!isAuthenticated) return null;

  return (
    <Card shadow css={{ my: '$5' }}>
      <Row align="center">
        <Avatar
          src={authUser!.avatar}
          alt={authUser!.username}
          color="gradient"
          bordered
        />
        <Text css={{ ml: '0.4rem' }}>{authUser!.username}</Text>
      </Row>
      <Col css={{ pl: '2.8rem', pb: '$8' }}>
        <Formik
          initialValues={{
            rating: 0,
            content: '',
          }}
          onSubmit={async (values, { setSubmitting, setValues }) => {
            try {
              setSubmitting(true);
              await sleep(2000);
              const { data } = await axiosClient.post<
                ICreateReviewResponse,
                { data: ICreateReviewResponse },
                ICreateReviewBody
              >(`/games/${gameId}/reviews/create`, {
                content: values.content,
                rating: values.rating / 20,
              });

              addReview({
                ...data.review,
                user: {
                  id: authUser!.id,
                  avatar: authUser!.avatar,
                  username: authUser!.username,
                },
              });
              addToast('Thanks! Reviews added ', {
                appearance: 'success',
                autoDismiss: true,
              });
              setValues({
                rating: 0,
                content: '',
              });
              setSubmitting(false);
            } catch (e) {
              const msg = (e as Error).message;

              addToast('Something went wrong while adding the review!', {
                appearance: 'error',
                autoDismiss: true,
              });
              console.error(msg);
            }
          }}
        >
          {({ values, handleChange, getFieldProps, isSubmitting }) => (
            <Form>
              <Rating
                ratingValue={values.rating}
                transition
                onClick={(rating) => {
                  handleChange({ target: { name: 'rating', value: rating } });
                }}
              />
              <Row align="flex-end">
                <Textarea
                  bordered
                  {...getFieldProps('content')}
                  color="secondary"
                  helperText="Write your review here..."
                />
                <Button
                  color="gradient"
                  auto
                  type="submit"
                  clickable={!isSubmitting}
                  css={{ ml: '$5' }}
                >
                  {isSubmitting ? (
                    <Loading color="white" size="sm" />
                  ) : (
                    <Text>Add Review!</Text>
                  )}
                </Button>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </Card>
  );
};
