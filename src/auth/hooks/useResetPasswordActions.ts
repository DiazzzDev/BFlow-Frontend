import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";

export const useResetPasswordActions = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (
        email: string,
        code: string,
        password: string
    ) => {

        try {
            setIsLoading(true);

            await authService
                .confirmForgotPassword(
                    email,
                    code,
                    password
                );

            await navigate(
                "/auth/login",
                {
                    replace: true
                }
            );

        } finally {
            setIsLoading(false);
        }
    };

    return {
        onSubmit,
        isLoading
    };
};