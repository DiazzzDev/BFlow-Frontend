import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

type ResetPasswordFormData = { code: string; password: string; confirmPassword: string };

const inputClass =
    "h-10 w-full rounded-lg border border-light-10 bg-surface px-3 text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

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
            className="w-full max-w-md space-y-4"
            onSubmit={(e) => {
                void handleSubmit((data) =>
                    onSubmit({ code: data.code, password: data.password })
                )(e);
            }}
        >
            <h1 className="text-3xl font-semibold">{t("auth.resetTitle")}</h1>

            <p className="text-helper">
                {t("auth.resetDescription")}
            </p>

            <input
                placeholder={t("auth.code")}
                disabled={isLoading}
                className={inputClass}
                {...register("code")}
            />
            {errors.code && (
                <p className="text-danger text-sm">{errors.code.message}</p>
            )}

            <input
                type="password"
                placeholder={t("auth.newPassword")}
                disabled={isLoading}
                className={inputClass}
                {...register("password")}
            />
            {errors.password && (
                <p className="text-danger text-sm">{errors.password.message}</p>
            )}

            <input
                type="password"
                placeholder={t("auth.confirmPassword")}
                disabled={isLoading}
                className={inputClass}
                {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
                <p className="text-danger text-sm">{errors.confirmPassword.message}</p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
            >
                {isLoading ? t("auth.resetLoading") : t("auth.resetButton")}
            </button>
        </form>
    );
};
