import { StateCreator } from 'zustand';
import { RootStore } from '@/store';
import { produce } from 'immer';

export type UserSliceType = {
  userName: string;
  displayName?: string | undefined;
  email?: string | undefined;
  setUserData: ({
    userName,
    displayName,
    email,
  }: {
    userName: string;
    displayName?: string | undefined;
    email?: string | undefined;
  }) => void;
};

export const createUserSlice: StateCreator<RootStore, [], [], UserSliceType> = (
  set,
) => ({
  userName: '',
  displayName: '',
  email: '',
  setUserData: ({ userName, displayName, email }) => {
    set(
      produce((state: RootStore) => {
        state.user.userName = userName;
        state.user.displayName = displayName ?? state.user.displayName;
        state.user.email = email ?? state.user.email;
      }),
    );
  },
});
