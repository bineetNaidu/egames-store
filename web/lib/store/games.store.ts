import { useLayoutEffect } from 'react';
import create, { StoreApi, UseBoundStore } from 'zustand';
import createZustandContext from 'zustand/context';
import type { Game } from '../types';

interface IGameStore {
  games: Game[];
  mostRatedGames: Game[];
  setGames: (games: Game[]) => void;
  setMostRatedGames: (games: Game[]) => void;
  addGame: (game: Game) => void;
  deleteGame: (id: number) => void;
  updateGame: (id: number, data: Partial<Game>) => void;
}

type InitialGameStateType = Pick<IGameStore, 'games' | 'mostRatedGames'>;

type GameStoreType = (
  preloadedState?: InitialGameStateType | {}
) => UseBoundStore<IGameStore, StoreApi<IGameStore>>;

const initialGameState: InitialGameStateType = {
  games: [],
  mostRatedGames: [],
};

let store: ReturnType<GameStoreType>;

const zustandContext = createZustandContext<IGameStore>();
export const useGameStore = zustandContext.useStore;
export const GameStoreProvider = zustandContext.Provider;

export const initializeGameStore: GameStoreType = (preloadedState = {}) =>
  create<IGameStore>((set) => ({
    ...initialGameState,
    ...preloadedState,

    setGames: (games) => set((state) => ({ games })),
    setMostRatedGames: (games) => set((state) => ({ mostRatedGames: games })),
    addGame: (game) => set((state) => ({ games: [...state.games, game] })),
    deleteGame: (id) =>
      set((state) => ({
        games: state.games.filter((game) => game.id !== id),
      })),
    updateGame: (id, data) =>
      set((state) => ({
        games: state.games.map((game) =>
          game.id === id ? { ...game, ...data } : game
        ),
      })),
  }));

export function createGameStore(initialState: InitialGameStateType) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeGameStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeGameStore(initialState);

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
