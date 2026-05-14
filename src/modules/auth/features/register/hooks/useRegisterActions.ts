import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { register } from "../register.services";

import { APIError } from "@/utils/api";

export const useRegisterActions = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onRegisterUser = async (email: string, password: string, fullName: string) => {
        setIsLoading(true);
        try {
            await toast.promise(
                register(email, password, fullName),
                {
                    pending: 'Registrando...',
                    success: 'Registro exitoso',
                    error: {
                        render({ data }: { data: APIError }) {
                            return data?.message || 'Error al registrar';
                        }
                    }
                }
            );

            navigate('/auth/login');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return { onRegisterUser, isLoading };
}