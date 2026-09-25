import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

interface LoginCredentials {
    email: string;
    password: string;
}

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("El formato del correo no es válido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmitLogin: (data: LoginCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const [showPassword, setShowPassword] = useState(false);

    const onInternalSubmit = (data: LoginFormInputs) => {
        toast.promise(onSubmitLogin(data), {
            loading: "Iniciando sesión...",
            success: "¡Bienvenido de vuelta!",
            error: (err) =>
                err instanceof Error ? err.message : "Error al iniciar sesión",
        });
    };

    const inputBase =
        "h-11 w-full rounded-xl border bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 transition-all duration-150";

    const inputNormal = `${inputBase} border-light-10 focus:border-primary/50`;
    const inputError = `${inputBase} border-danger/60 focus:ring-danger/40`;

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}
        >
            <div className="w-full max-w-md flex-col space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-label" htmlFor="txtEmail">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            id="txtEmail"
                            disabled={isLoading}
                            {...register("email")}
                            placeholder="tu@correo.com"
                            aria-invalid={isSubmitted && !!errors.email}
                            aria-describedby={isSubmitted && errors.email ? "email-error" : undefined}
                            className={`${isSubmitted && errors.email ? inputError : inputNormal} pl-10`}
                        />
                    </div>
                    {isSubmitted && errors.email && (
                        <p id="email-error" className="text-xs text-danger mt-1 flex items-center gap-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label
                            className="text-xs font-medium text-label"
                            htmlFor="txtPassword"
                        >
                            Contraseña
                        </label>
                        <Link
                            to="/auth/forgot-password"
                            tabIndex={isLoading ? -1 : undefined}
                            className="text-xs font-medium text-primary hover:opacity-75 transition-opacity"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="relative">
                        <Lock
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            id="txtPassword"
                            disabled={isLoading}
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            aria-invalid={isSubmitted && !!errors.password}
                            aria-describedby={isSubmitted && errors.password ? "password-error" : undefined}
                            className={`${isSubmitted && errors.password ? inputError : inputNormal} px-10`}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-helper hover:text-light transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {isSubmitted && errors.password && (
                        <p id="password-error" className="text-xs text-danger mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="h-11 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-40 cursor-pointer transition-colors duration-200 inline-flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Iniciando sesión...
                        </>
                    ) : (
                        "Iniciar sesión"
                    )}
                </button>
            </div>

            <p className="mt-6 text-center text-xs text-helper">
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
    );
};
