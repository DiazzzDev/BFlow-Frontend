import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import {
    authErrorClass,
    authFieldClass,
    authInputClass,
    authLabelClass,
    authPrimaryButtonClass,
} from "@/modules/auth/utils/authStyles";
import { toast } from "sonner";
import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";
import { useNavigate } from "react-router";

type FormData = { email: string };

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => Promise<unknown>;
    isLoading: boolean;
}

export const ForgotPasswordForm = ({ onSubmit, isLoading }: ForgotPasswordFormProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const forgotPasswordSchema = z.object({
        email: z.string().min(1, t("auth.validationEmailRequired")).email(t("auth.validationEmailInvalid")),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
    });

    const handleSubmitEmail = async (email: string) => {
        try {
            await onSubmit(email);

            toast.success(
                "Hemos enviado un código de restablecimiento de contraseña a tu correo electrónico."
            );
            void navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err) {
            toast.error(
                getCognitoErrorMessage(
                    err,
                    "Error al enviar código de restablecimiento de contraseña. Por favor, inténtelo de nuevo."
                )
            );
        }
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                void handleSubmit((data) => handleSubmitEmail(data.email))(e);
            }}
        >
            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtEmail">
                    {t("auth.email")}
                </label>
                <input
                    id="txtEmail"
                    type="email"
                    autoComplete="email"
                    placeholder={t("auth.emailPlaceholder")}
                    disabled={isLoading}
                    className={authInputClass}
                    {...register("email")}
                />
                {errors.email && <p className={authErrorClass}>{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className={`mt-2 ${authPrimaryButtonClass}`}>
                {isLoading ? t("auth.forgotLoading") : t("auth.forgotButton")}
            </button>
        </form>
    );
};
