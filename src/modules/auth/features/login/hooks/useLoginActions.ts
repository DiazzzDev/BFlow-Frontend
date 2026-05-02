import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { login } from "../login.services.ts"

import { APIError } from "@/utils/api"

export const useLoginActions = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitLogin = async (email: string, password: string) => {
        if (!email.trim() || !password.trim()) {
            toast.warning("Credenciales vacias");
            return;
        }
        setIsLoading(true);
        try {
            await toast.promise(
                login(email, password),
                {
                    pending: 'Iniciando sesión...',
                    success: 'Bienvenido de vuelta',
                    error: {
                        render({ data }: { data: APIError }) {
                            return data?.message || 'Credenciales inválidas';
                        }
                    }
                }
            );
            navigate('/app/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return { onSubmitLogin, isLoading };
}