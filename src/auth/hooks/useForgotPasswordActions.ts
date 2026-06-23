import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";

export const useForgotPasswordActions = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (
        email: string
    ) => {

        try {
            setIsLoading(true);

            await authService.forgotPassword(
                email
            );

            await navigate(
                `/auth/reset-password?email=${encodeURIComponent(email)}`,
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