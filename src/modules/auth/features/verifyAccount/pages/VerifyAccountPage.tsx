import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useVerifyAccountActions } from "../../../../../auth/hooks/useVerifyAccountActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
    code: string;
};

export const VerifyAccountPage = () => {

    const [params] =
        useSearchParams();

    const email =
        params.get("email") ?? "";

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
    } = useVerifyAccountActions();

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(
                        data => onSubmit(
                            email,
                            data.code
                        )
                    )(e);
                }}
            >

                <h1 className="text-3xl font-semibold">
                    Verificar cuenta
                </h1>

                <p className="text-text-muted">
                    Revisa tu correo e ingresa el código.
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

                {errors.code && (
                    <p className="text-warning text-sm">
                        {errors.code.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {
                        isLoading
                            ? "Verificando..."
                            : "Verificar cuenta"
                    }
                </Button>

            </form>

        </div>
    );
};