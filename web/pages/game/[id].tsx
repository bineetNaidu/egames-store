import {
  Container,
  Grid,
  Image,
  Text,
  Button,
  Col,
  Card,
  Row,
  Avatar,
} from '@nextui-org/react';
import { GetServerSideProps, NextPage } from 'next';
import { axiosClient } from '../../lib/axiosClient';
import { COOKIE_TOKEN_NAME } from '../../lib/constant';
import { initializeUserStore } from '../../lib/store/user.store';
import {
  IAuthResponse,
  IGetGameResponse,
  IGetReviewResponse,
} from '../../lib/types';
import Head from 'next/head';

interface GameSSRProps extends IGetGameResponse, IGetReviewResponse {}

const Game: NextPage<GameSSRProps> = ({ game, reviews }) => {
  if (!game) {
    return (
      <Container>
        <Head>
          <title>Game not found </title>
        </Head>
        <Text h1>Game not found</Text>
      </Container>
    );
  }

  return (
    <Container css={{ mb: '1rem' }}>
      <Head>
        <title>{game.name}</title>
        <meta name="description" content={game.info} />
      </Head>
      <Grid.Container>
        <Grid xs={5}>
          <Image src={game.thumbnail} alt={game.name} css={{ width: '100%' }} />
        </Grid>
        <Grid xs={5}>
          <Col>
            <Text h2>{game.name}</Text>
            <Text css={{ mt: '1rem', mb: '2rem' }}>{game.info}</Text>
            <Button color="gradient">Buy for ${game.price}</Button>
          </Col>
        </Grid>
      </Grid.Container>

      <Grid.Container justify="center">
        <Grid xs={7}>
          <Col>
            <Text h2 css={{ mt: '4rem', mb: '1rem' }}>
              More Details
            </Text>
            <Text>{game.details}</Text>
          </Col>
        </Grid>

        <Grid xs={7}>
          <Col>
            <Text h2 css={{ mt: '4rem', mb: '1rem' }}>
              Reviews
            </Text>

            {reviews.map((review) => (
              <Card key={review.id} shadow>
                <Text h5 css={{ fontStyle: 'italic', fontWeight: '$light' }}>
                  ~ {review.content}
                </Text>
                <Row>
                  <Avatar src={review.user?.avatar} />
                  <Text>{review.user?.username}</Text>
                </Row>
              </Card>
            ))}
          </Col>
        </Grid>
      </Grid.Container>
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

  const getGameResponse = await axiosClient.get<IGetGameResponse>(
    `/games/${ctx.query.id}`
  );

  const getGameReviewsResponse = await axiosClient.get<IGetReviewResponse>(
    `/games/${ctx.query.id}/reviews`
  );

  const { game } = getGameResponse.data;
  const { reviews } = getGameReviewsResponse.data;

  return {
    notFound: !game,
    props: {
      initialUserStore: JSON.parse(JSON.stringify(userStore.getState())),
      game,
      reviews,
    },
  };
};

export default Game;
