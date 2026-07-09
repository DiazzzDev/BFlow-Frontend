import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetPassword } from "../../../../../auth/hooks/useResetPassword";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resetPasswordSchema = z
    .object({
        code: z.string().min(1, "Código requerido"),
        password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"], // Esto asigna el error específicamente a este campo
    });


type ResetPasswordRawData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {

    const [params] = useSearchParams();

    const email = params.get("email") ?? "";

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm<FormData>();

    const { mutateAsync: onSubmit, isPending: isLoading } = useResetPassword();

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(
                        (data: FormData) =>
                            onSubmit(data)
                    )(e);
                }}
            >

                <h1 className="text-3xl font-semibold">
                    Nueva contraseña
                </h1>

                <p className="text-text-muted">
                    Revisa tu correo y pega el código recibido.
                </p>

                <Input
                    placeholder="Código"
                    disabled={isLoading}
                    {...register(
                        "code",
                        {
                            required:
                                "Código requerido"
                        }
                    )}
                />

                <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    disabled={isLoading}
                    {...register(
                        "password",
                        {
                            required:
                                "Contraseña requerida",
                            minLength: {
                                value: 8,
                                message:
                                    "Mínimo 8 caracteres"
                            }
                        }
                    )}
                />

                <Input
                    type="password"
                    placeholder="Confirmar contraseña"
                    disabled={isLoading}
                    {...register(
                        "confirmPassword",
                        {
                            validate:
                                value =>
                                    value === watch("password")
                                    || "Las contraseñas no coinciden"
                        }
                    )}
                />

                {errors.confirmPassword && (
                    <p className="text-warning text-sm">
                        {
                            errors.confirmPassword.message
                        }
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {
                        isLoading
                            ? "Actualizando..."
                            : "Actualizar contraseña"
                    }
                </Button>

            </form>

        </div>
    );
};