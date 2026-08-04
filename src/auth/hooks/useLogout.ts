import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/authStore";

export const useLogout = () => {
    const clearSession = useAuthStore((state) => state.clearSession);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            await authService.logout();
        },
        onSettled: () => {
            clearSession();
            queryClient.clear();
            void navigate("/auth/login", { replace: true });
        },
    });
};
