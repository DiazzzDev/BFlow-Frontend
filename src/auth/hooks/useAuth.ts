import { useAuthStore } from "@/auth/authStore";

/**
 * Estado de auth ya reconciliado por AuthProvider (Cognito + perfil).
 * Preferir esto sobre consultar Amplify ad-hoc en la UI.
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
