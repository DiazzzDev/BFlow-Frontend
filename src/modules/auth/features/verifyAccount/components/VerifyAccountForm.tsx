import { useForm } from "react-hook-form";
import { Mail, KeyRound, RefreshCw, Edit3, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";

type FormData = {
    email: string;
    code: string;
};

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all duration-200";

interface VerifyAccountFormProps {
    initialEmail: string;
    onSubmit: (args: { email: string; code: string }) => Promise<unknown>;
    onResendCode: (email: string) => Promise<unknown>;
    isLoading: boolean;
    isResending: boolean;
}

export const VerifyAccountForm = ({
    initialEmail,
    onSubmit,
    onResendCode,
    isLoading,
    isResending,
}: VerifyAccountFormProps) => {
    const navigate = useNavigate();
    const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
    const [cooldown, setCooldown] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitted },
    } = useForm<FormData>({
        defaultValues: {
            email: initialEmail,
            code: "",
        },
    });

    const currentEmail = watch("email");

    // Cooldown timer effect
    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // Keep form value in sync if initialEmail prop changes later
    useEffect(() => {
        if (initialEmail && !currentEmail) {
            setValue("email", initialEmail);
        }
    }, [initialEmail, setValue, currentEmail]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            await toast.promise(onSubmit({ email: data.email, code: data.code }), {
                loading: "Verificando cuenta...",
                success: "¡Cuenta verificada exitosamente!",
                error: (err) => getCognitoErrorMessage(err, "Error al verificar el código"),
            }).unwrap();
            void navigate("/auth/login");
        } catch {
            // Error handled by toast
        }
    };

    const handleResend = async () => {
        if (!currentEmail || cooldown > 0 || isResending) {
            return;
        }

        try {
            await toast.promise(onResendCode(currentEmail), {
                loading: "Reenviando código...",
                success: "Código enviado a tu correo",
                error: (err) => getCognitoErrorMessage(err, "Error al reenviar el código"),
            }).unwrap();
            setCooldown(30);
        } catch {
            // Error handled by toast
        }
    };

    return (
        <form
            className="w-full max-w-md space-y-6"
            onSubmit={(e) => {
                void handleSubmit(handleFormSubmit)(e);
            }}
        >
            <div className="space-y-4">
                {/* Email Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-label" htmlFor="txtEmail">
                        Correo electrónico a verificar
                    </label>

                    {!isEditingEmail && currentEmail ? (
                        <div className="flex items-center justify-between p-3.5 rounded-xl border border-light-10 bg-surface/60">
                            <div className="flex items-center gap-2.5 truncate">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-sm font-medium text-light truncate">
                                    {currentEmail}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditingEmail(true)}
                                className="text-xs text-helper hover:text-light inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0 ml-2"
                            >
                                <Edit3 size={14} /> Cambiar
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                            />
                            <input
                                id="txtEmail"
                                disabled={isLoading}
                                {...register("email", {
                                    required: "El correo es requerido",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Formato de correo no válido",
                                    },
                                })}
                                placeholder="tu@correo.com"
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    )}
                    {isSubmitted && errors.email && (
                        <p className="text-sm text-danger mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Code Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-label" htmlFor="txtCode">
                            Código de verificación (6 dígitos)
                        </label>
                    </div>

                    <div className="relative">
                        <KeyRound
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-helper"
                        />
                        <input
                            id="txtCode"
                            disabled={isLoading}
                            maxLength={6}
                            {...register("code", {
                                required: "Ingresa el código enviado a tu correo",
                                minLength: {
                                    value: 6,
                                    message: "El código debe tener 6 dígitos",
                                },
                            })}
                            placeholder="123456"
                            className={`${inputClass} pl-11 tracking-[0.4em] font-mono text-lg font-semibold`}
                        />
                    </div>
                    {isSubmitted && errors.code && (
                        <p className="text-sm text-danger mt-1">{errors.code.message}</p>
                    )}
                </div>

                {/* Resend Code Option */}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-helper">¿No recibiste el código?</span>
                    <button
                        type="button"
                        disabled={cooldown > 0 || isResending || !currentEmail}
                        onClick={() => void handleResend()}
                        className="text-xs font-medium text-primary hover:opacity-80 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-1.5 cursor-pointer transition-opacity"
                    >
                        <RefreshCw size={13} className={isResending ? "animate-spin" : ""} />
                        {cooldown > 0
                            ? `Reenviar código (${cooldown}s)`
                            : isResending
                                ? "Reenviando..."
                                : "Reenviar código"}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-50 cursor-pointer transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? (
                        "Verificando..."
                    ) : (
                        <>
                            Verificar mi cuenta <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>

            <div className="p-3.5 rounded-xl border border-light-10 bg-surface/40 text-xs text-helper flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-primary shrink-0" />
                <span>Revisa tu carpeta de spam o promociones si no lo encuentras en tu bandeja principal.</span>
            </div>
        </form>
    );
};
