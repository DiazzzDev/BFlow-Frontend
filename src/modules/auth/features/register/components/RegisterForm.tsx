import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

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
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    fullName: z.string().min(1, "El nombre completo es requerido"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onRegisterUser: (data: RegisterCredentials) => Promise<unknown>;
    isLoading: boolean;
}

/** Returns 0–3 strength score */
function getPasswordStrength(pwd: string): number {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
}

const strengthLabels = ["", "Débil", "Regular", "Buena", "Fuerte"];
const strengthColors = [
    "",
    "bg-danger",
    "bg-warning",
    "bg-primary",
    "bg-success",
];

export const RegisterForm = ({
    onRegisterUser,
    isLoading,
}: RegisterFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitted },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const [showPassword, setShowPassword] = useState(false);
    const passwordValue = watch("password") ?? "";
    const strengthScore = getPasswordStrength(passwordValue);

    const onInternalSubmit = (data: RegisterFormInputs) => {
        toast.promise(onRegisterUser(data), {
            loading: "Creando tu cuenta...",
            success: "¡Cuenta creada! Revisa tu correo para verificarla.",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear la cuenta",
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
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label
                        className="text-xs font-medium text-label"
                        htmlFor="txtFullName"
                    >
                        Nombre completo
                    </label>
                    <div className="relative">
                        <User
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            disabled={isLoading}
                            {...register("fullName")}
                            id="txtFullName"
                            placeholder="Tu nombre completo"
                            aria-invalid={isSubmitted && !!errors.fullName}
                            className={`${isSubmitted && errors.fullName ? inputError : inputNormal} pl-10`}
                        />
                    </div>
                    {isSubmitted && errors.fullName && (
                        <p className="text-xs text-danger">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label
                        className="text-xs font-medium text-label"
                        htmlFor="txtEmail"
                    >
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
                            className={`${isSubmitted && errors.email ? inputError : inputNormal} pl-10`}
                        />
                    </div>
                    {isSubmitted && errors.email && (
                        <p className="text-xs text-danger">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label
                        className="text-xs font-medium text-label"
                        htmlFor="txtPassword"
                    >
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            disabled={isLoading}
                            {...register("password")}
                            id="txtPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            aria-invalid={isSubmitted && !!errors.password}
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

                    {/* Password strength indicator */}
                    {passwordValue.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                            strengthScore >= level
                                                ? strengthColors[strengthScore]
                                                : "bg-light-10"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className={`text-[10px] font-medium ${
                                strengthScore <= 1 ? "text-danger" :
                                strengthScore === 2 ? "text-warning" :
                                strengthScore === 3 ? "text-primary" : "text-success"
                            }`}>
                                {strengthScore > 0 ? `Contraseña ${strengthLabels[strengthScore]}` : ""}
                            </p>
                        </div>
                    )}

                    {isSubmitted && errors.password && (
                        <p className="text-xs text-danger">{errors.password.message}</p>
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
                            Creando cuenta...
                        </>
                    ) : (
                        "Crear cuenta"
                    )}
                </button>
            </div>

            <p className="mt-6 text-center text-xs text-helper">
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
    );
};
