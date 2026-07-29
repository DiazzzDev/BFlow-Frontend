import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";

import { isValidEmail } from "@/utils/validators";

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"

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
    const [showPassword, setShowPassword] = useState(false);
    return (
        <form action="" onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}>
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-label" htmlFor="txtFullName">
                        Nombre completo
                    </label>

                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            disabled={isLoading}
                            {...register('fullName', { required: 'El nombre completo es requerido' })}
                            id="txtFullName"
                            placeholder="Tu nombre completo"
                            className={`${inputClass} pl-11`}
                        />
                    </div>
                    {isSubmitted && errors.fullName && (
                        <p className="text-sm text-danger mt-1">
                            {errors.fullName.message}
                        </p>
                    )}
                </div>

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
                            placeholder="tu@correo.com"
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
                    <label className="text-sm font-medium text-label" htmlFor="txtPassword">
                        Contraseña
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />

                        <input
                            disabled={isLoading}
                            {...register('password', { required: 'La contraseña es requerida', minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' } })}
                            id="txtPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimo 8 caracteres"
                            className={`${inputClass} px-11`}
                        />

                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} /> :
                            <Eye size={18} />}
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
                    {isLoading ? "Creando cuenta..." : "Crear cuenta →"}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                ¿Ya tienes cuenta?{" "}
                <Link
                    to="/auth/login"
                    className={`font-medium hover:opacity-80 ${
                        isLoading
                            ? "pointer-events-none text-helper"
                            : "text-primary"
                    }`}
                >
                    Inicia sesión
                </Link>
            </p>
        </form>
    )
}
