import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import {
    authErrorClass,
    authFieldClass,
    authInputClass,
    authLabelClass,
    authPrimaryButtonClass,
} from "@/modules/auth/utils/authStyles";

type ResetPasswordFormData = { code: string; password: string; confirmPassword: string };

interface ResetPasswordFormProps {
    onSubmit: (data: { code: string; password: string }) => Promise<unknown>;
    isLoading: boolean;
}

export const ResetPasswordForm = ({ onSubmit, isLoading }: ResetPasswordFormProps) => {
    const { t } = useTranslation();
    const resetPasswordSchema = z.object({
        code: z.string().min(1, t("auth.validationCodeRequired")),
        password: z.string().min(8, t("auth.validationPasswordMin")),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("auth.validationPasswordsMatch"),
        path: ["confirmPassword"],
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                void handleSubmit((data) =>
                    onSubmit({ code: data.code, password: data.password })
                )(e);
            }}
        >
            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtCode">
                    {t("auth.code")}
                </label>
                <input
                    id="txtCode"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    disabled={isLoading}
                    className={`${authInputClass} font-mono tracking-[0.3em]`}
                    {...register("code")}
                />
                {errors.code && <p className={authErrorClass}>{errors.code.message}</p>}
            </div>

            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtNewPassword">
                    {t("auth.newPassword")}
                </label>
                <PasswordInput
                    id="txtNewPassword"
                    autoComplete="new-password"
                    placeholder={t("auth.passwordPlaceholder")}
                    disabled={isLoading}
                    {...register("password")}
                />
                {errors.password && <p className={authErrorClass}>{errors.password.message}</p>}
            </div>

            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtConfirmPassword">
                    {t("auth.confirmPassword")}
                </label>
                <PasswordInput
                    id="txtConfirmPassword"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className={authErrorClass}>{errors.confirmPassword.message}</p>
                )}
            </div>

            <button type="submit" disabled={isLoading} className={`mt-2 ${authPrimaryButtonClass}`}>
                {isLoading ? t("auth.resetLoading") : t("auth.resetButton")}
            </button>
        </form>
    );
};
