import { useAuthStore } from "@/auth/authStore";

/**
 * Auth state already reconciled by AuthProvider (Cognito + profile).
 * Prefer this over ad-hoc Amplify calls in the UI.
 */
export const useAuth = () => {
    const authStatus = useAuthStore((state) => state.authStatus);
    const user = useAuthStore((state) => state.user);

    return {
        user,
        authStatus,
        isAuthenticated: authStatus === "authenticated",
        isChecking: authStatus === "checking",
        isUnauthenticated: authStatus === "not-authenticated",
    };
};
