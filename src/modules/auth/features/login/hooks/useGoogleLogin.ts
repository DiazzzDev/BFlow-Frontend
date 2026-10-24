import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";

import { loginWithGoogle } from "../login.service";

import { useAuthStore } from "@/auth/authStore";
import type { InternalUser } from "@/auth/InternalUser";
import {
    getPostLoginPath,
    savePendingPlan,
} from "@/modules/auth/utils/postLoginRedirect";

export const useGoogleLogin = () => {
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const planId = searchParams.get("plan");

    return useMutation({
        mutationFn: () => {
            savePendingPlan(planId);
            return loginWithGoogle();
        },
        onSuccess: (user: InternalUser | void) => {
            // Existing Cognito session: no redirect happened — enter the app directly.
            if (!user) {
                return;
            }

            setSession(user);
            savePendingPlan(null);
            void navigate(getPostLoginPath(planId), { replace: true });
        },
        onError: () => {
            savePendingPlan(null);
        },
    });
};
