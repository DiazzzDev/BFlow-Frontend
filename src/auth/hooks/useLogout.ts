import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/store/authStore";

export const useLogout = () => {

    const navigate = useNavigate();

    const logout = async () => {

        try {

            await authService.logout();

        } finally {

            useAuthStore
                .getState()
                .clearUser();

            localStorage.removeItem(
                "bflow-auth-storage"
            );

            await navigate(
                "/auth/login",
                {
                    replace: true
                }
            );
        }
    };

    return {
        logout
    };
};