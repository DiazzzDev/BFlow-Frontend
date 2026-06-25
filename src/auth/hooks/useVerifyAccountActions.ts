import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/auth/services/authService";

export const useVerifyAccountActions = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (
        email: string,
        code: string
    ) => {

        try {

            setIsLoading(true);

            await authService.confirmRegister(
                email,
                code
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