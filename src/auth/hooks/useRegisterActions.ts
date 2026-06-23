import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";

export const useRegisterActions = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onRegisterUser = async (
        email: string,
        password: string,
        fullName: string
    ) => {

        try {

            setIsLoading(true);

            await authService.register(
                email,
                password,
                fullName
            );

            await navigate(
                `/auth/verify-account?email=${encodeURIComponent(email)}`,
                {
                    replace: true
                }
            );

        } finally {
            setIsLoading(false);
        }
    };

    return {
        onRegisterUser,
        isLoading
    };
};