import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { loginWithGoogle } from "../login.service";

import { useAuthStore } from "@/auth/authStore";
import type { InternalUser } from "@/auth/InternalUser";

export const useGoogleLogin = () => {
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => loginWithGoogle(),
        onSuccess: (user: InternalUser | void) => {
            // Existing Cognito session: no redirect happened — enter the app directly.
            if (!user) {
                return;
            }

            setSession(user);

            if (user.status === "DELETED") {
                return;
            }

            void navigate("/app/dashboard", { replace: true });
        },
    });
};
