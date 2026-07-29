import { useForm } from "react-hook-form"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

import { isValidEmail } from "@/utils/validators"
import { InternalUser } from "@/auth/InternalUser"

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"

interface LoginFormInputs {
    email: string;
    password: string;
};

interface LoginFormProps {
   onSubmitLogin: (data: LoginFormInputs) => Promise<InternalUser | null>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({ mode: 'onSubmit' });
    const onInternalSubmit = (data: LoginFormInputs) => {
        void onSubmitLogin(data);
    };
    const [showPassword, setShowPassword] = useState(false);
    return (
        <form action="" onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}>
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-label" htmlFor="txtEmail">
                        Correo electrónico
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            id="txtEmail"
                            disabled={isLoading}
                            {...register('email', { required: 'El correo electrónico es requerido', validate: (value) => isValidEmail(value) || "El formato del correo no es válido" })}
                            placeholder="Correo electrónico"
                            className={`${inputClass} pl-11`}
                        />
                    </div>
                    {isSubmitted && errors.email && (
                        <p className="text-sm text-danger mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-label" htmlFor="txtPassword">
                            Contraseña
                        </label>

                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-primary hover:opacity-80"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />

                        <input
                            id="txtPassword"
                            disabled={isLoading}
                            {...register('password', { required: 'La contraseña es requerida' })}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className={`${inputClass} px-11`}
                        />

                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                        {isSubmitted && errors.password && (
                            <p className="text-sm text-danger mt-1">
                                {errors.password.message}
                            </p>
                        )}
                </div>

                <button
                    type="submit"
                    className="h-12 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión →"}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                ¿No tienes cuenta?{" "}
                <Link
                    to="/auth/register"
                    className={`font-medium hover:opacity-80 ${
                        isLoading
                            ? "pointer-events-none text-helper"
                            : "text-primary"
                    }`}
                >
                    Crea una gratis
                </Link>
            </p>
        </form>
    )
}
