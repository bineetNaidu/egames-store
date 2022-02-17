import { useLayoutEffect } from 'react';
import create, { StoreApi, UseBoundStore } from 'zustand';
import createZustandContext from 'zustand/context';
import type { GameReview } from '../types';

interface IGameReviewStore {
  reviews: GameReview[];
  setReviews: (reviews: GameReview[]) => void;
  addReview: (review: GameReview) => void;
  deleteReview: (id: number) => void;
}

type InitialGameReviewStoreStateType = Pick<IGameReviewStore, 'reviews'>;

type GameReviewStoreStoreType = (
  preloadedState?: InitialGameReviewStoreStateType | {}
) => UseBoundStore<IGameReviewStore, StoreApi<IGameReviewStore>>;

const initialGameReviewStoreState: InitialGameReviewStoreStateType = {
  reviews: [],
};

let store: ReturnType<GameReviewStoreStoreType>;

const zustandContext = createZustandContext<IGameReviewStore>();
export const useGameReviewStore = zustandContext.useStore;
export const GameReviewStoreStoreProvider = zustandContext.Provider;

export const initializeGameReviewStoreStore: GameReviewStoreStoreType = (
  preloadedState = {}
) =>
  create<IGameReviewStore>((set) => ({
    ...initialGameReviewStoreState,
    ...preloadedState,

    setReviews: (reviews) => set(() => ({ reviews })),
    addReview: (review) =>
      set((state) => ({ reviews: [review, ...state.reviews] })),
    deleteReview: (id) =>
      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
      })),
  }));

export function createGameReviewStore(
  initialState: InitialGameReviewStoreStateType
) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeGameReviewStoreStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeGameReviewStoreStore(initialState);

  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  useLayoutEffect(() => {
    if (initialState && !!store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });
    }
  }, [initialState]);

  return () => store;
}
