import { create } from 'zustand';

export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
