import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { completeOAuthLogin } from "../oauthCallback.service";

import { useAuthStore } from "@/auth/authStore";

export const useOAuthCallback = () => {
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

                if (user.status === "DELETED") {
                    return;
                }

                toast.success("Bienvenido");
                void navigate("/app/dashboard", { replace: true });
            } catch (error) {
                console.error(error);
                clearSession();
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Error al iniciar sesión",
                );
                void navigate("/auth/login", { replace: true });
            }
        };

        void syncUser();
    }, [navigate, setSession, clearSession]);
};
