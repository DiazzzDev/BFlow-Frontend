import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { getCognitoErrorMessage } from "@/auth/utils/cognitoErrors";
import { PasswordInput } from "@/modules/auth/components/PasswordInput";
import {
    authErrorClass,
    authFieldClass,
    authHintClass,
    authInputClass,
    authLabelClass,
    authPrimaryButtonClass,
} from "@/modules/auth/utils/authStyles";

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

interface RegisterFormProps {
    onRegisterUser: (data: RegisterCredentials) => Promise<unknown>;
    isLoading: boolean;
}

export const RegisterForm = ({
    onRegisterUser,
    isLoading,
}: RegisterFormProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const navigate = useNavigate();

    const onInternalSubmit = async (data: RegisterFormInputs) => {
        try {
            await toast.promise(onRegisterUser(data), {
                loading: "Creando cuenta en Bflow Studio...",
                success: "Cuenta creada. Te enviamos un código a tu correo.",
                error: (err) => getCognitoErrorMessage(err, "Error al crear la cuenta"),
            }).unwrap();
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
            className="flex flex-col gap-4"
        >
            <div className={authFieldClass}>
                <label className={authLabelClass} htmlFor="txtFullName">
                    {t("auth.fullName")}
                </label>
                <input
                    id="txtFullName"
                    autoComplete="name"
                    disabled={isLoading}
                    {...register("fullName")}
                    placeholder={t("auth.namePlaceholder")}
                    className={authInputClass}
                />
                {isSubmitted && errors.fullName && (
                    <p className={authErrorClass}>{errors.fullName.message}</p>
                )}
            </div>

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
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register("password")}
                    placeholder={t("auth.passwordPlaceholder")}
                />
                {isSubmitted && errors.password ? (
                    <p className={authErrorClass}>{errors.password.message}</p>
                ) : (
                    <p className={authHintClass}>
                        Requisitos: mínimo 8 caracteres, al menos 1 letra mayúscula y 1 número o símbolo.
                    </p>
                )}
            </div>

            <button type="submit" className={`mt-2 ${authPrimaryButtonClass}`} disabled={isLoading}>
                {isLoading ? t("auth.registerLoading") : t("auth.registerButton")}
            </button>
        </form>
    );
};
