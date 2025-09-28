import { createUserSlice, UserSliceType } from '@/store/slices/user-slice';
import { createStore } from 'zustand';

export type RootStore = {
  user: UserSliceType;
};

export const createRootStore = () =>
  createStore<RootStore>((...args) => ({
    user: { ...createUserSlice(...args) },
  }));
