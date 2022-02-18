import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { axiosClient } from '../lib/axiosClient';
import { COOKIE_TOKEN_NAME } from '../lib/constant';
import { initializeUserStore, useUserStore } from '../lib/store/user.store';
import { IAuthResponse } from '../lib/types';
import { Container, Text } from '@nextui-org/react';
import { ReviewCard } from '../components/ReviewCard';

const MyReviews: NextPage = () => {
  const myReviews = useUserStore((s) => s.myReviews);
  return (
    <Container>
      <Text h1>My Reviews</Text>

      {myReviews.map((review) => (
        <Link
          key={review.id}
          href={`/game/${review.game_id}#review-${review.id}`}
          scroll
        >
          <a>
            <ReviewCard review={review} clickable />
          </a>
        </Link>
      ))}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userStore = initializeUserStore();
  const authCookie = ctx.req.headers.cookie
    ?.split(';')
    .find((c) => c.trim().startsWith(`${COOKIE_TOKEN_NAME}=`));
  const token = authCookie?.split('=')[1];
  const { data } = await axiosClient.get<IAuthResponse>('/auth/profile', {
    headers: {
      'x-access-token': token || '',
    },
  });

  if (data.user) {
    userStore.getState().setAuthUser(data.user);
  }

  return {
    redirect: !!data.user
      ? false
      : {
          destination: '/login',
        },
    props: {
      initialUserStore: JSON.parse(JSON.stringify(userStore.getState())),
    },
  };
};

export default MyReviews;
