import { Navigate, Outlet, useSearchParams } from "react-router";

import { AuthLoadingScreen } from "@/auth/components/AuthLoadingScreen";
import { useAuthStore } from "@/auth/authStore";
import { getPostLoginPath } from "@/modules/auth/utils/postLoginRedirect";

/**
 * Rutas públicas de auth (login/register).
 * Si ya hay sesión Cognito + perfil, manda a la app.
 */
export const GuestRoute = () => {
    const authStatus = useAuthStore((state) => state.authStatus);
    const [searchParams] = useSearchParams();

    if (authStatus === "checking") {
        return <AuthLoadingScreen />;
    }

    if (authStatus === "authenticated") {
        return <Navigate to={getPostLoginPath(searchParams.get("plan"))} replace />;
    }

    return <Outlet />;
};
