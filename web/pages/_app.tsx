import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Container, NextUIProvider, createTheme } from '@nextui-org/react';
import { Navbar } from '../components/Navbar';
import {
  UserStoreProvider,
  useCreateUserStore as createUserStore,
} from '../lib/store/user.store';
import { ToastProvider } from 'react-toast-notifications';
import {
  CategoriesStoreProvider,
  createCategoriesStore,
} from '../lib/store/categories.store';
import { GameStoreProvider, createGameStore } from '../lib/store/games.store';
import {
  createGameReviewStore,
  GameReviewStoreStoreProvider,
} from '../lib/store/gameReviews.store';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    type: 'white',
    theme: {
      colors: {
        background: '#10075c',
        text: 'rgb(191 219 254 / 1)',
        textPrimary: 'rgb(192 132 252 / 1)',
        textPrimaryDeep: 'rgb(147 51 234 / 1)',
        link: 'rgb(191 219 254 / 1)',
      },
    },
  });
  const userStore = createUserStore(pageProps.initialUserStore);
  const categoriesStore = createCategoriesStore(
    pageProps.initialCategoriesStore
  );
  const gameStore = createGameStore(pageProps.initialGameStore);
  const gameReviewStore = createGameReviewStore(
    pageProps.initialGameReviewStore
  );

  return (
    <>
      <UserStoreProvider createStore={userStore}>
        <NextUIProvider theme={theme}>
          <Container css={{ h: '100%', minHeight: '100vh' }}>
            <ToastProvider>
              <CategoriesStoreProvider createStore={categoriesStore}>
                <GameStoreProvider createStore={gameStore}>
                  <Navbar />
                  <GameReviewStoreStoreProvider createStore={gameReviewStore}>
                    <Component {...pageProps} />
                  </GameReviewStoreStoreProvider>
                </GameStoreProvider>
              </CategoriesStoreProvider>
            </ToastProvider>
          </Container>
        </NextUIProvider>
      </UserStoreProvider>
    </>
  );
}

export default MyApp;
