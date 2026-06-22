import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/auth/hooks/useAuth";
//import { useAuthStore } from "@/utils/authMe/auth.store.ts";

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
    </div>
);

export const ProtectedRoute = () => {

    const auth = useAuth();

    if (auth.isLoading) {
        return <LoadingSpinner />;
    }

    if (auth.error) {

        console.error(
            "OIDC ERROR:",
            auth.error
        );

        return <Navigate to="/auth/login" replace />;
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};