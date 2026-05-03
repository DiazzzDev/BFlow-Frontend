import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { login } from "../login.services.ts"

import { APIError } from "@/utils/api"
import { isValidEmail } from "@/utils/validators.ts"
import { useAuthStore } from "@/utils/authMe/auth.store.ts"

export const useLoginActions = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { checkAuth } = useAuthStore();

    const onSubmitLogin = async (email: string, password: string) => {
        if (isValidEmail(email) === false) {
            toast.warning("Por favor, ingrese un correo electrónico válido");
            return;
        }
        if (!password) {
            toast.warning("Por favor, ingrese su contraseña");
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

            // Después del login exitoso, verificar y cargar datos del usuario
            await checkAuth();

            navigate('/app/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return { onSubmitLogin, isLoading };
}