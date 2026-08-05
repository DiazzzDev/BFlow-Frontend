import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { completeOAuthLogin } from "../oauthCallback.service";

import { useAuthStore } from "@/auth/authStore";

export const useOAuthCallback = () => {
    const navigate = useNavigate();
    const setSession = useAuthStore((state) => state.setSession);
    const clearSession = useAuthStore((state) => state.clearSession);
    const syncedRef = useRef(false);

    useEffect(() => {
        if (syncedRef.current) {
            return;
        }
        syncedRef.current = true;

        const syncUser = async () => {
            try {
                const user = await completeOAuthLogin();
                setSession(user);
                void navigate("/app/dashboard", { replace: true });
            } catch (error) {
                console.error(error);
                clearSession();
                void navigate("/auth/login", { replace: true });
            }
        };

        void syncUser();
    }, [navigate, setSession, clearSession]);
};
