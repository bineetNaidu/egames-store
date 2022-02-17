import {
  Container,
  Grid,
  Image,
  Text,
  Button,
  Col,
  Row,
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
import { ReviewCard } from '../../components/ReviewCard';
import {
  initializeGameReviewStoreStore,
  useGameReviewStore,
} from '../../lib/store/gameReviews.store';

interface GameSSRProps extends IGetGameResponse {}

const Game: NextPage<GameSSRProps> = ({ game }) => {
  const reviews = useGameReviewStore((state) => state.reviews);

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
          <Image
            src={game.thumbnail}
            alt={game.name}
            height="fit-content"
            width="fit-content"
          />
        </Grid>
        <Grid xs={5}>
          <Col>
            <Text h2>{game.name}</Text>
            <Row align="center">
              <Text b>TAGS: </Text>
              {game.tags.map((tag) => (
                <Text
                  b
                  css={{
                    py: '$1',
                    px: '$4',
                    backgroundColor: '$blue700',
                    mx: '$4',
                    my: '$2',
                    fontSize: '$xs',
                    borderRadius: '$xs',
                  }}
                  key={tag}
                >
                  {tag}
                </Text>
              ))}
            </Row>
            <Row align="center">
              <Text b>CATEGORY: {game.category?.name}</Text>
            </Row>
            <Text css={{ mt: '1rem', mb: '2rem' }}>{game.info}</Text>

            <Row align="center">
              <Button color="gradient">Buy for ${game.price}</Button>
              <Text b css={{ ml: '$4' }}>
                Size: {game.game_size}
              </Text>
            </Row>
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
              <ReviewCard key={review.id} review={review} />
            ))}
          </Col>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userStore = initializeUserStore();
  const gameReviewStore = initializeGameReviewStoreStore();

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

  if (reviews.length) {
    gameReviewStore.getState().setReviews(reviews);
  }

  return {
    notFound: !game,
    props: {
      initialUserStore: JSON.parse(JSON.stringify(userStore.getState())),
      initialGameReviewStore: JSON.parse(
        JSON.stringify(gameReviewStore.getState())
      ),
      game,
    },
  };
};

export default Game;
