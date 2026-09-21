import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { isUserNotConfirmedError } from "../login.service";
import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";

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

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-200";

interface LoginFormProps {
    onSubmitLogin: (data: LoginCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const onInternalSubmit = async (data: LoginFormInputs) => {
        setUnverifiedEmail(null);
        try {
            await toast.promise(onSubmitLogin(data), {
                loading: "Iniciando sesión...",
                success: "¡Bienvenido de vuelta!",
                error: (err) => {
                    if (isUserNotConfirmedError(err)) {
                        return "Tu cuenta no ha sido verificada. Redirigiendo a verificación...";
                    }
                    return getCognitoErrorMessage(err, "Error al iniciar sesión");
                },
            });
        } catch (err) {
            if (isUserNotConfirmedError(err)) {
                const cleanEmail = data.email.trim().toLowerCase();
                setUnverifiedEmail(cleanEmail);
                setTimeout(() => {
                    void navigate(`/auth/verify-account?email=${encodeURIComponent(cleanEmail)}`);
                }, 1200);
            }
        }
    };

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}
            className="space-y-4"
        >
            {unverifiedEmail && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                    <AlertCircle size={20} className="shrink-0 text-amber-400 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-amber-200">Cuenta sin verificar</p>
                        <p className="text-xs text-amber-300/80 mt-0.5">
                            Tu cuenta ({unverifiedEmail}) requiere verificación de correo antes de ingresar.
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/auth/verify-account?email=${encodeURIComponent(unverifiedEmail)}`)
                            }
                            className="mt-2 text-xs font-semibold text-amber-300 hover:text-amber-100 flex items-center gap-1 group cursor-pointer"
                        >
                            Verificar correo ahora <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

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
                            {...register("email")}
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
                    <div className="flex items-center justify-between">
                        <label
                            className="text-sm font-medium text-label"
                            htmlFor="txtPassword"
                        >
                            Contraseña
                        </label>

                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
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
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className={`${inputClass} px-11`}
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
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
                    className="h-12 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-50 cursor-pointer transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión →"}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                ¿No tienes cuenta?{" "}
                <Link
                    to="/auth/register"
                    className={`font-medium hover:opacity-80 transition-opacity ${
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
