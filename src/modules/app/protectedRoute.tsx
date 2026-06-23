import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/auth/store/authStore";

export const ProtectedRoute = () => {

    const user = useAuthStore(
        state => state.user
    );

    if (!user) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    return <Outlet />;
};