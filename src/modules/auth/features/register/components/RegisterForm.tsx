import { Eye, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { isValidEmail } from "@/utils/validators";

type RegisterFormInputs = {
    email: string;
    password: string;
    fullName: string;
};

interface RegisterFormProps {
    onRegisterUser: (email: string, password: string, fullName: string) => void;
    isLoading: boolean;
}

export const RegisterForm = ({ onRegisterUser, isLoading }: RegisterFormProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm<RegisterFormInputs>({ mode: 'onSubmit' });

    const onInternalSubmit = (data: RegisterFormInputs) => {
        onRegisterUser(data.email, data.password, data.fullName);
    }
    return (
        <form action="" onSubmit={handleSubmit(onInternalSubmit)}>
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-label" htmlFor="txtFullName">
                        Nombre completo
                    </label>

                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <Input
                            disabled={isLoading}
                            {...register('fullName', { required: 'El nombre completo es requerido' })}
                            id="txtFullName"
                            placeholder="Tu nombre completo"
                            className="h-12 rounded-xl border-border bg-bg-card pl-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                        />
                    </div>
                    {isSubmitted && errors.fullName && (
                        <p className="text-sm text-warning mt-1">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>

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
                            placeholder="tu@correo.com"
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
                    </div>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                        />

                        <Input
                            disabled={isLoading}
                            {...register('password', { required: 'La contraseña es requerida', minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' } })}
                            id="txtPassword"
                            type="password"
                            placeholder="Minimo 8 caracteres"
                            className="h-12 rounded-xl border-border bg-bg-card px-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                        />

                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                            <Eye size={18} />
                        </button>
                    </div>
                    {isSubmitted && errors.password && (
                        <p className="text-sm text-warning mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button className="h-12 w-full rounded-xl font-medium text-white hover:brightness-110" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear cuenta →"}
                </Button>
            </div>

            <p className="mt-8 text-center text-sm text-text-muted">
                ¿Ya tienes cuenta?{" "}
                <Link to="/auth/login" className="font-medium text-brand-accent hover:opacity-80" style={{
                    pointerEvents: isLoading ? 'none' : 'auto',
                    color: isLoading ? 'gray' : '',
                }}>
                    Inicia sesión
                </Link>
            </p>
        </form>
    )
}