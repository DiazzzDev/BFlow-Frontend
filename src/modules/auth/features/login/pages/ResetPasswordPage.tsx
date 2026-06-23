import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useResetPasswordActions } from "../../../../../auth/hooks/useResetPasswordActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type FormData = {
    code: string;
    password: string;
    confirmPassword: string;
};

export const ResetPasswordPage = () => {

    const [params] = useSearchParams();

    const email = params.get("email") ?? "";

    console.log(
        "EMAIL PARAM:",
        email
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm<FormData>();

    const {
        onSubmit,
        isLoading
    } = useResetPasswordActions();

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(
                        (data) =>
                            onSubmit(
                                email,
                                data.code,
                                data.password
                            )
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