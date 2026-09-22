import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { InternalUser } from "./InternalUser";

import { queryClient } from "@/queryClient";

export type AuthStatus =
    | "checking"
    | "authenticated"
    | "not-authenticated"
    | "account-deleted";

interface AuthState {
    user: InternalUser | null;
    authStatus: AuthStatus;
    setSession: (user: InternalUser) => void;
    setDeletedAccount: () => void;
    clearSession: () => void;
    setChecking: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            authStatus: "checking",

            setSession: (user) =>
                set(() => {
                    if (user.status === "DELETED") {
                        queryClient.clear();
                        return { user: null, authStatus: "account-deleted" };
                    }

                    return {
                        user,
                        authStatus: "authenticated",
                    };
                }),

            setDeletedAccount: () => {
                queryClient.clear();
                set({
                    user: null,
                    authStatus: "account-deleted",
                });
            },

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
