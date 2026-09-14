import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { InternalUser } from "./InternalUser";

export type AuthStatus = "checking" | "authenticated" | "not-authenticated";

interface AuthState {
    user: InternalUser | null;
    authStatus: AuthStatus;
    setSession: (user: InternalUser) => void;
    clearSession: () => void;
    setChecking: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            authStatus: "checking",

            setSession: (user) =>
                set({
                    user,
                    authStatus: "authenticated",
                }),

            clearSession: () =>
                set({
                    user: null,
                    authStatus: "not-authenticated",
                }),

            setChecking: () =>
                set({
                    authStatus: "checking",
                }),
        }),
        {
            name: "bflow-auth-storage",
            // Cache profile only. authStatus always starts as "checking"
            // and bootstrap resolves it against Cognito.
            partialize: (state) => ({ user: state.user }),
        },
    ),
);
