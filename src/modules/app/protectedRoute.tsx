import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

import { useAuthStore } from "@/utils/authMe/auth.store.ts";

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
    </div>
);

export const ProtectedRoute = () => {
    const { isAuthenticated, isInitializing, checkAuth } = useAuthStore();

    useEffect(() => {
        if (isInitializing) {
            checkAuth();
        }
    }, [checkAuth, isInitializing]);

    if (isInitializing) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};