import { useForm } from "react-hook-form";

import { useForgotPasswordActions } from "../../../../../auth/hooks/useForgotPasswordActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";

type FormData = {
    email: string;
};

export const ForgotPasswordPage = () => {

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FormData>();

    const {
        onSubmit,
        isLoading
    } = useForgotPasswordActions();

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(
                        data => onSubmit(data.email)
                    )(e);
                }}
            >

                <h1 className="text-3xl font-semibold">
                    Recuperar contraseña
                </h1>

                <p className="text-text-muted">
                    Te enviaremos un código de recuperación.
                </p>

                <Input
                    placeholder="Correo electrónico"
                    disabled={isLoading}
                    {...register("email", {
                        required: "El correo es requerido",

                        validate: value =>
                            isValidEmail(value)
                            || "Correo inválido"
                    })}
                />

                {errors.email && (
                    <p className="text-warning text-sm">
                        {errors.email.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {
                        isLoading
                            ? "Enviando..."
                            : "Enviar código"
                    }
                </Button>
            </form>
        </div>
    );
};