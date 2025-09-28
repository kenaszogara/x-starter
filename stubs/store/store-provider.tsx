'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { RootStore, createRootStore } from './index';

export type RootStoreApi = ReturnType<typeof createRootStore>;

export const RootStoreContext = createContext<RootStoreApi | undefined>(
  undefined,
);

export type RootStoreProviderProps = {
  children: ReactNode;
};

// refer: https://github.com/facebook/react/issues/31330
export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
  const storeRef = useRef<RootStoreApi>(undefined);

  if (!storeRef?.current) {
    storeRef.current = createRootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef?.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

// hooks to be used in the components
export const useRootStore = <T,>(selector: (store: RootStore) => T): T => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useRootStore must be used within BoundStoreProvider`);
  }

  return useStore(rootStoreContext, selector);
};

// functions to be used outside of the react lifecycle
/**
 *
 * example: const user = useRootStoreApi().getState().user;
 * refer: https://github.com/pmndrs/zustand/discussions/1986#discussioncomment-10931792
 */
export const useRootStoreApi = (): RootStoreApi => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useRootStoreApi must be used within BoundStoreProvider`);
  }

  return rootStoreContext;
};
