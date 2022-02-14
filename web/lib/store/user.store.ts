import { useLayoutEffect } from 'react';
import create, { StoreApi, UseBoundStore } from 'zustand';
import createZustandContext from 'zustand/context';
import type { User } from '../types';

interface IUserStore {
  authUser: User | null;
  isAuthenticated: boolean;
  setAuthUser: (user: User) => void;
  removeAuthUser: () => void;
  updateAuthUser: (user: Partial<User>) => void;
}

type InitialUserStateType = Pick<IUserStore, 'authUser' | 'isAuthenticated'>;

type UserStoreType = (
  preloadedState?: InitialUserStateType | {}
) => UseBoundStore<IUserStore, StoreApi<IUserStore>>;

const initialUserState: InitialUserStateType = {
  authUser: null,
  isAuthenticated: false,
};

let store: ReturnType<UserStoreType>;

const zustandContext = createZustandContext<IUserStore>();
export const useUserStore = zustandContext.useStore;
export const UserStoreProvider = zustandContext.Provider;

export const initializeUserStore: UserStoreType = (preloadedState = {}) =>
  create<IUserStore>((set) => ({
    ...initialUserState,
    ...preloadedState,

    setAuthUser: (user) =>
      set({
        authUser: user,
        isAuthenticated: true,
      }),

    removeAuthUser: () =>
      set({
        authUser: null,
        isAuthenticated: false,
      }),

    updateAuthUser: (user) =>
      set((state) => ({ authUser: { ...state.authUser!, ...user } })),
  }));

export function useCreateUserStore(initialState: InitialUserStateType) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeUserStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeUserStore(initialState);

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
