import { useForm } from "react-hook-form"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { isValidEmail } from "@/utils/validators"

type LoginFormInputs = {
    email: string;
    password: string;
};

interface LoginFormProps {
    onSubmitLogin: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({ mode: 'onSubmit' });
    const onInternalSubmit = (data: LoginFormInputs) => {
        void onSubmitLogin(data.email, data.password);
    };
    const [showPassword, setShowPassword] = useState(false);
    return (
        <form action="" onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}>
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-label" htmlFor="txtEmail">
                        Correo electrónico
                    </label>

                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <Input
                            disabled={isLoading}
                            {...register('email', { required: 'El correo electrónico es requerido', validate: (value) => isValidEmail(value) || "El formato del correo no es válido" })}
                            placeholder="Correo electrónico"
                            className="h-12 rounded-xl border-border bg-bg-card pl-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                        />
                    </div>
                    {isSubmitted && errors.email && (
                        <p className="text-sm text-warning mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-text-label" htmlFor="txtPassword">
                            Contraseña
                        </label>

                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-brand-accent hover:opacity-80"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                        />

                        <Input
                            disabled={isLoading}
                            {...register('password', { required: 'La contraseña es requerida' })}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className="h-12 rounded-xl border-border bg-bg-card px-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                        />

                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                        {isSubmitted && errors.password && (
                            <p className="text-sm text-warning mt-1">
                                {errors.password.message}
                            </p>
                        )}
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl font-medium text-white hover:brightness-110" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión →"}
                </Button>
            </div>

            <p className="mt-8 text-center text-sm text-text-muted">
                ¿No tienes cuenta?{" "}
                <Link to="/auth/register" className="font-medium text-brand-accent hover:opacity-80" style={{
                    pointerEvents: isLoading ? 'none' : 'auto',
                    color: isLoading ? 'var(--text-muted)' : '',
                }}>
                    Crea una gratis
                </Link>
            </p>
        </form>
    )
}