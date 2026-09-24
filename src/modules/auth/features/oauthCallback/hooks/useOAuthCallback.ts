import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { completeOAuthLogin } from "../oauthCallback.service";

import { useAuthStore } from "@/auth/authStore";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

export const useOAuthCallback = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const setSession = useAuthStore((state) => state.setSession);
    const clearSession = useAuthStore((state) => state.clearSession);

    // Guard against Strict Mode double-mount running sync twice
    const syncedRef = useRef(false);

    // Exchange OAuth redirect for session, then route
    useEffect(() => {
        if (syncedRef.current) {
            return;
        }
        syncedRef.current = true;

        const syncUser = async () => {
            try {
                const user = await completeOAuthLogin();
                setSession(user);
                toast.success(getApiMessage(user, t("auth.welcome")));
                void navigate("/app/dashboard", { replace: true });
            } catch (error) {
                console.error(error);
                clearSession();
                toast.error(getApiErrorMessage(error, t("auth.loginError")));
                void navigate("/auth/login", { replace: true });
            }
        };

        void syncUser();
    }, [navigate, setSession, clearSession, t]);
};
