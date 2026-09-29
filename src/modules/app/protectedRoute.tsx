import { Navigate, Outlet } from "react-router";

import { AuthLoadingScreen } from "@/auth/components/AuthLoadingScreen";
import { useAuthStore } from "@/auth/authStore";

/**
 * Rutas privadas de /app. Espera el bootstrap y exige sesión reconciliada.
 */
export const ProtectedRoute = () => {
    const authStatus = useAuthStore((state) => state.authStatus);

    if (authStatus === "checking") {
        return <AuthLoadingScreen />;
    }

    if (authStatus !== "authenticated") {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};
