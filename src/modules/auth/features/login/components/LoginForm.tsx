import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

interface LoginCredentials {
    email: string;
    password: string;
}

type LoginFormInputs = LoginCredentials;

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

interface LoginFormProps {
    onSubmitLogin: (data: LoginCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const LoginForm = ({ onSubmitLogin, isLoading }: LoginFormProps) => {
    const { t } = useTranslation();
    const loginSchema = z.object({
        email: z.string().min(1, t("auth.validationEmailRequired")).email(t("auth.validationEmailInvalid")),
        password: z.string().min(1, t("auth.validationPasswordRequired")),
    });
    // RHF form (validate on submit only)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    // Password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

    // Submit credentials via toast.promise
    const onInternalSubmit = (data: LoginFormInputs) => {
        toast.promise(onSubmitLogin(data), {
            loading: t("auth.loginLoading"),
            success: (response) => getApiMessage(response, t("auth.welcome")),
            error: (error) => getApiErrorMessage(error, t("auth.loginError")),
        });
    };

    return (
        <form
            action=""
            onSubmit={(e) => {
                void handleSubmit(onInternalSubmit)(e);
            }}
        >
            <div className="w-full max-w-md flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-label" htmlFor="txtEmail">
                        {t("auth.email")}
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
                            placeholder={t("auth.email")}
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
                            {t("auth.password")}
                        </label>

                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-primary hover:opacity-80"
                        >
                            {t("auth.forgotPassword")}
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
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light"
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
                    className="h-12 w-full rounded-xl font-medium bg-primary text-light hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? t("auth.loginLoading") : t("auth.signInButton")}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                {t("auth.noAccount")} {" "}
                <Link
                    to="/auth/register"
                    className={`font-medium hover:opacity-80 ${
                        isLoading
                            ? "pointer-events-none text-helper"
                            : "text-primary"
                    }`}
                >
                    {t("auth.createFree")}
                </Link>
            </p>
        </form>
    );
};
