import { Navigate, Outlet } from "react-router-dom";

import { AuthLoadingScreen } from "@/auth/components/AuthLoadingScreen";
import { useAuthStore } from "@/auth/authStore";

/**
 * Rutas públicas de auth (login/register).
 * Si ya hay sesión Cognito + perfil, manda a la app.
 */
export const GuestRoute = () => {
    const authStatus = useAuthStore((state) => state.authStatus);

    if (authStatus === "checking") {
        return <AuthLoadingScreen />;
    }

    if (authStatus === "authenticated") {
        return <Navigate to="/app/dashboard" replace />;
    }

    return <Outlet />;
};
