import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { loginWithGoogle } from "../login.service";

import { useAuthStore } from "@/auth/authStore";
import type { InternalUser } from "@/auth/InternalUser";

export const useGoogleLogin = () => {
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => loginWithGoogle(),
        onSuccess: (user: InternalUser | void) => {
            // Si ya había sesión Cognito, no hubo redirect: entramos directo.
            if (!user) {
                return;
            }

            setSession(user);
            void navigate("/app/dashboard", { replace: true });
        },
    });
};
