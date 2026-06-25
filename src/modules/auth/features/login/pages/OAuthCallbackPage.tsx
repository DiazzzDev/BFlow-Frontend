import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

import { useAuthStore } from "@/auth/store/authStore";
import type { InternalUser } from "@/auth/types/InternalUser";
import { config } from "@/api/config";

export const OAuthCallbackPage = () => {
    const navigate = useNavigate();
    const syncedRef = useRef(false);

    useEffect(() => {
        if (syncedRef.current) {
            return
        };
        syncedRef.current = true;

        const syncUser = async () => {
            try {
                const session = await fetchAuthSession();
                const accessToken = session.tokens?.accessToken.toString();
                const idToken = session.tokens?.idToken?.toString();

                if (!accessToken || !idToken) {
                    throw new Error("Tokens not found");
                }

                const response = await fetch(
                    `${config.API_BASE_URL}/api/v2/auth/sync`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ idToken }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to sync user")
                };

                const user = await response.json() as InternalUser;
                useAuthStore.getState().setUser(user);
                void navigate("/app/dashboard", { replace: true });

            } catch (error) {
                console.error(error);
                void navigate("/auth/login", { replace: true });
            }
        };

        void syncUser();
    }, [navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            Iniciando sesión...
        </div>
    );
};