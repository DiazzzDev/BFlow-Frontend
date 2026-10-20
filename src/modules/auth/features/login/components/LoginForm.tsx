import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { isUserNotConfirmedError } from "../login.service";

import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import {
    authErrorClass,
    authFieldClass,
    authInputClass,
    authLabelClass,
    authPrimaryButtonClass,
    authTextLinkClass,
} from "@/modules/auth/utils/authStyles";

interface LoginCredentials {
    email: string;
    password: string;
}

type LoginFormInputs = LoginCredentials;

interface LoginFormProps {
    onSubmitLogin: (data: LoginCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const { t } = useTranslation();
    const loginSchema = z.object({
        email: z
            .string()
            .min(1, t("auth.validationEmailRequired"))
            .email(t("auth.validationEmailInvalid")),
        password: z.string().min(1, t("auth.validationPasswordRequired")),
    });
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: { email: params.get("email") ?? "", password: "" },
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
            }).unwrap();
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
            className="flex flex-col gap-4"
        >
            {unverifiedEmail && (
                <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-sm">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-warning" />
                    <div className="flex-1">
                        <p className="font-medium text-light">Cuenta sin verificar</p>
                        <p className="mt-0.5 text-xs text-helper">
                            Tu cuenta ({unverifiedEmail}) requiere verificación de correo antes de ingresar.
                        </p>
                        <button
                            type="button"
                            onClick={() =>
                                void navigate(`/auth/verify-account?email=${encodeURIComponent(unverifiedEmail)}`)
                            }
                            className="group mt-2 flex cursor-pointer items-center gap-1 text-xs font-semibold text-warning transition-opacity hover:opacity-80"
                        >
                            Verificar correo ahora <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtEmail">
                    {t("auth.email")}
                </label>
                <input
                    id="txtEmail"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...register("email")}
                    placeholder={t("auth.emailPlaceholder")}
                    className={authInputClass}
                />
                {isSubmitted && errors.email && (
                    <p className={authErrorClass}>{errors.email.message}</p>
                )}
            </div>

            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtPassword">
                    {t("auth.password")}
                </label>
                <PasswordInput
                    id="txtPassword"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register("password")}
                    placeholder="••••••••"
                />
                {isSubmitted && errors.password && (
                    <p className={authErrorClass}>{errors.password.message}</p>
                )}
                <Link
                    to="/auth/forgot-password"
                    className={`self-end text-xs ${authTextLinkClass}`}
                >
                    {t("auth.forgotPassword")}
                </Link>
            </div>

            <button type="submit" className={`mt-2 ${authPrimaryButtonClass}`} disabled={isLoading}>
                {isLoading ? t("auth.loginLoading") : t("auth.signInButton")}
            </button>
        </form>
    );
};
