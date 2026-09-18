import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

interface RegisterCredentials {
    email: string;
    password: string;
    fullName: string;
}

type RegisterFormInputs = RegisterCredentials;

const inputClass =
    "h-12 w-full rounded-xl border border-light-10 bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

interface RegisterFormProps {
    onRegisterUser: (data: RegisterCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const RegisterForm = ({
    onRegisterUser,
    isLoading,
}: RegisterFormProps) => {
    const { t } = useTranslation();
    const registerSchema = z.object({
        email: z.string().min(1, t("auth.validationEmailRequired")).email(t("auth.validationEmailInvalid")),
        password: z.string().min(1, t("auth.validationPasswordRequired")).min(8, t("auth.validationPasswordMin")),
        fullName: z.string().min(1, t("auth.validationNameRequired")),
    });
    // RHF form (validate on submit only)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    // Password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

    // Submit signup via toast.promise
    const onInternalSubmit = (data: RegisterFormInputs) => {
        toast.promise(onRegisterUser(data), {
            loading: t("auth.registerLoading"),
            success: (response) =>
                getApiMessage(response, t("auth.registerSuccess")),
            error: (error) => getApiErrorMessage(error, t("auth.registerError")),
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
                    <label
                        className="text-sm font-medium text-label"
                        htmlFor="txtFullName"
                    >
                        {t("auth.fullName")}
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
                            placeholder={t("auth.namePlaceholder")}
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
                            placeholder={t("auth.emailPlaceholder")}
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
                        {t("auth.password")}
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
                            placeholder={t("auth.passwordPlaceholder")}
                            className={`${inputClass} px-11`}
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-helper hover:text-light"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
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
                    {isLoading ? t("auth.registerLoading") : t("auth.registerButton")}
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-helper">
                {t("auth.hasAccount")} {" "}
                <Link
                    to="/auth/login"
                    className={`font-medium hover:opacity-80 ${
                        isLoading
                            ? "pointer-events-none text-helper"
                            : "text-primary"
                    }`}
                >
                    {t("auth.signIn")}
                </Link>
            </p>
        </form>
    );
};
