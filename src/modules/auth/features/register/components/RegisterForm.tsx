import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";

interface RegisterCredentials {
    email: string;
    password: string;
    fullName: string;
}

const registerSchema = z.object({
    email: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("El formato del correo no es válido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .refine((val) => /[A-Z]/.test(val), {
            message: "La contraseña debe incluir al menos una letra mayúscula (ej: A, B, C)",
        })
        .refine((val) => /[a-z]/.test(val), {
            message: "La contraseña debe incluir al menos una letra minúscula (ej: a, b, c)",
        })
        .refine((val) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(val), {
            message: "La contraseña debe incluir al menos un número o símbolo (ej: 1, 2, !@#)",
        }),
    fullName: z.string().min(1, "El nombre completo es requerido"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-200";

interface RegisterFormProps {
    onRegisterUser: (data: RegisterCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const RegisterForm = ({
    onRegisterUser,
    isLoading,
}: RegisterFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onInternalSubmit = async (data: RegisterFormInputs) => {
        try {
            await toast.promise(onRegisterUser(data), {
                loading: "Creando cuenta en Cognito...",
                success: "Cuenta creada. Te enviamos un código a tu correo.",
                error: (err) => getCognitoErrorMessage(err, "Error al crear la cuenta"),
            });
            void navigate(`/auth/verify-account?email=${encodeURIComponent(data.email.trim().toLowerCase())}`);
        } catch (err) {
            // Check if user already exists
            if (
                typeof err === "object" &&
                err !== null &&
                (err as { name?: string }).name === "UsernameExistsException"
            ) {
                setTimeout(() => {
                    void navigate(`/auth/login?email=${encodeURIComponent(data.email.trim().toLowerCase())}`);
                }, 1500);
            }
        }
    };

    return (
        <form
            onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}
        >
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium text-label"
                        htmlFor="txtFullName"
                    >
                        Nombre completo
                    </label>

                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            disabled={isLoading}
                            {...register("fullName")}
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
                    <label
                        className="text-sm font-medium text-label"
                        htmlFor="txtEmail"
                    >
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
                    <label
                        className="text-sm font-medium text-label"
                        htmlFor="txtPassword"
                    >
                        Contraseña
                    </label>

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />

                        <input
                            disabled={isLoading}
                            {...register("password")}
                            id="txtPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Ej. MiClave2026!"
                            className={`${inputClass} px-11`}
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    {isSubmitted && errors.password ? (
                        <p className="text-sm text-danger mt-1">
                            {errors.password.message}
                        </p>
                    ) : (
                        <p className="text-xs text-helper mt-1">
                            Requisitos: mínimo 8 caracteres, al menos 1 letra mayúscula y 1 número o símbolo.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="h-12 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-50 cursor-pointer transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? "Creando cuenta..." : "Crear cuenta →"}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                ¿Ya tienes cuenta?{" "}
                <Link
                    to="/auth/login"
                    className={`font-medium hover:opacity-80 transition-opacity ${
                        isLoading
                            ? "pointer-events-none text-helper"
                            : "text-primary"
                    }`}
                >
                    Inicia sesión
                </Link>
            </p>
        </form>
    );
};
