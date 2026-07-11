import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useVerifyAccount } from "../../../../../auth/hooks/useVerifyAccount";

type FormData = {
    code: string;
};

const inputClass =
    "h-10 w-full rounded-lg border border-border bg-card px-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"

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

    const { mutateAsync: onSubmit, isPending: isLoading } = useVerifyAccount();

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                className="w-full max-w-md space-y-4"
                onSubmit={(e) => {
                    void handleSubmit(
                        data => onSubmit({ email, code: data.code })
                    )(e);
                }}
            >

                <h1 className="text-3xl font-semibold">
                    Verificar cuenta
                </h1>

                <p className="text-muted-foreground">
                    Revisa tu correo e ingresa el código.
                </p>

                <input
                    placeholder="Código"
                    disabled={isLoading}
                    className={inputClass}
                    {...register(
                        "code",
                        {
                            required:
                                "Código requerido"
                        }
                    )}
                />

                {errors.code && (
                    <p className="text-danger text-sm">
                        {errors.code.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
                >
                    {
                        isLoading
                            ? "Verificando..."
                            : "Verificar cuenta"
                    }
                </button>

            </form>

        </div>
    );
};
