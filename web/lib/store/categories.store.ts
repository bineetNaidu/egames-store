import { useLayoutEffect } from 'react';
import create, { StoreApi, UseBoundStore } from 'zustand';
import createZustandContext from 'zustand/context';
import type { Category } from '../types';

interface ICategoriesStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
}

type InitialCategoriesStateType = Pick<ICategoriesStore, 'categories'>;

type CategoriesStoreType = (
  preloadedState?: InitialCategoriesStateType | {}
) => UseBoundStore<ICategoriesStore, StoreApi<ICategoriesStore>>;

const initialCategoriesState: InitialCategoriesStateType = {
  categories: [],
};

let store: ReturnType<CategoriesStoreType>;

const zustandContext = createZustandContext<ICategoriesStore>();
export const useCategoriesStore = zustandContext.useStore;
export const CategoriesStoreProvider = zustandContext.Provider;

export const initializeCategoriesStore: CategoriesStoreType = (
  preloadedState = {}
) =>
  create<ICategoriesStore>((set) => ({
    ...initialCategoriesState,
    ...preloadedState,

    setCategories: (categories) => set((state) => ({ categories })),
    addCategory: (category) =>
      set((state) => ({ categories: [...state.categories, category] })),
  }));

export function createCategoriesStore(
  initialState: InitialCategoriesStateType
) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeCategoriesStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeCategoriesStore(initialState);

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
