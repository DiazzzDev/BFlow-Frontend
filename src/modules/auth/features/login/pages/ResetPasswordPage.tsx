import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetPassword } from "../../../../../auth/hooks/useResetPassword";

const resetPasswordSchema = z
    .object({
        code: z.string().min(1, "Código requerido"),
        password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const inputClass =
    "h-10 w-full rounded-lg border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"

export const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const email = params.get("email") ?? "";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const { mutateAsync: resetPassword, isPending: isLoading } = useResetPassword();

    const onSubmit = async (data: ResetPasswordFormData) => {
        await resetPassword({
            email,
            code: data.code,
            password: data.password,
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(onSubmit)(e);
                }}
            >
                <h1 className="text-3xl font-semibold">
                    Nueva contraseña
                </h1>

                <p className="text-muted-foreground">
                    Revisa tu correo y pega el código recibido.
                </p>

                <input
                    placeholder="Código"
                    disabled={isLoading}
                    className={inputClass}
                    {...register("code")}
                />
                {errors.code && (
                    <p className="text-danger text-sm">{errors.code.message}</p>
                )}

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    disabled={isLoading}
                    className={inputClass}
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-danger text-sm">{errors.password.message}</p>
                )}

                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    disabled={isLoading}
                    className={inputClass}
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="text-danger text-sm">
                        {errors.confirmPassword.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                >
                    {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
            </form>
        </div>
    );
};
