import { create } from "zustand";
import { persist } from "zustand/middleware";

import { InternalUser } from "../types/InternalUser";

interface AuthState {
  user: InternalUser | null;

  setUser: (
    user: InternalUser
  ) => void;

  clearUser: () => void;
}


export const useAuthStore = create<AuthState>()(

  persist(

    (set) => ({

      user: null,

      setUser: (user) =>
        set({
          user
        }),

      clearUser: () =>
        set({
          user: null
        }),

    }),
    {
      name: "bflow-auth-storage",
    }
  )
);