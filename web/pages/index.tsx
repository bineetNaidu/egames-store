import { Card, Button, Text, Divider, Grid } from '@nextui-org/react';
import type { GetServerSideProps, NextPage } from 'next';
import { axiosClient } from '../lib/axiosClient';
import { COOKIE_TOKEN_NAME } from '../lib/constant';
import { initializeUserStore, useUserStore } from '../lib/store/user.store';
import {
  IAuthResponse,
  ICategoriesResponse,
  IGamesResponse,
} from '../lib/types';
import { useToasts } from 'react-toast-notifications';
import { useEffect } from 'react';
import {
  initializeCategoriesStore,
  useCategoriesStore,
} from '../lib/store/categories.store';
import { initializeGameStore, useGameStore } from '../lib/store/games.store';
import { GameCard } from '../components/GameCard';

const Home: NextPage = () => {
  const { addToast } = useToasts();
  const { isAuthenticated, authUser } = useUserStore();
  const categories = useCategoriesStore((state) => state.categories);
  const games = useGameStore((state) => state.games);

  useEffect(() => {
    if (isAuthenticated) {
      addToast(`Welcome!, ${authUser!.username}`, {
        appearance: 'success',
        autoDismiss: true,
      });
    }
  }, [isAuthenticated, authUser, addToast]);

  return (
    <Grid.Container gap={2}>
      <Grid xs={3}>
        <Card>
          <Text h3 css={{ textAlign: 'center' }}>
            CATEGORIES
          </Text>
          <Divider color="secondary" />
          {categories.map((c) => (
            <Button color="gradient" ghost css={{ my: '0.5rem' }} key={c.id}>
              {c.name}
            </Button>
          ))}
        </Card>
      </Grid>
      <Grid xs={9}>
        <Card>
          <Grid.Container gap={2} justify="center">
            {games.map((g) => (
              <Grid xs={4} key={g.id}>
                <GameCard game={g} />
              </Grid>
            ))}
          </Grid.Container>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const userStore = initializeUserStore();
  const gamesStore = initializeGameStore();
  const categoriesStore = initializeCategoriesStore();

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

  const { data: categoryApiData } = await axiosClient.get<ICategoriesResponse>(
    '/categories'
  );
  categoriesStore.getState().setCategories(categoryApiData.categories);

  const { data: gamesApiData } = await axiosClient.get<IGamesResponse>(
    '/games'
  );
  gamesStore.getState().setGames(gamesApiData.games);

  return {
    props: {
      initialUserStore: JSON.parse(JSON.stringify(userStore.getState())),
      initialCategoriesStore: JSON.parse(
        JSON.stringify(categoriesStore.getState())
      ),
      initialGameStore: JSON.parse(JSON.stringify(gamesStore.getState())),
    },
  };
};
export default Home;
