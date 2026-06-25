import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";
import { useAuthStore } from "@/auth/store/authStore";
import type { InternalUser } from "@/auth/types/InternalUser";

export const useLoginActions = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmitLogin = async (
        email: string,
        password: string
    ) => {

        try {

            setIsLoading(true);

            const result = await authService.login(
                email,
                password
            );

            if (!result.isSignedIn) {
                console.log(
                    result.nextStep.signInStep
                );

                throw new Error(
                    result.nextStep.signInStep
                );
            }

            const session =
                await authService.getSession();

            const accessToken =
                session.tokens?.accessToken?.toString();

            const idToken =
                session.tokens?.idToken?.toString();

            if (!accessToken || !idToken) {
                throw new Error(
                    "Tokens not found"
                );
            }

            const response = await fetch(
                "http://localhost:8080/api/v2/auth/sync",
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        idToken,
                        email,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to sync user"
                );
            }

            const user =
                await response.json() as InternalUser;

            useAuthStore
                .getState()
                .setUser(user);

            await navigate(
                "/app/dashboard",
                {
                    replace: true,
                }
            );

        } finally {
            setIsLoading(false);
        }
    };

    return {
        onSubmitLogin,
        isLoading,
    };
};