import { useForm } from "react-hook-form";

type FormData = {
    code: string;
};

const inputClass =
    "h-10 w-full rounded-lg border border-light-10 bg-surface px-3 text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

interface VerifyAccountFormProps {
    onSubmit: (code: string) => Promise<unknown>;
    isLoading: boolean;
}

export const VerifyAccountForm = ({ onSubmit, isLoading }: VerifyAccountFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    return (
        <form
            className="w-full max-w-md space-y-4"
            onSubmit={(e) => {
                void handleSubmit((data) => onSubmit(data.code))(e);
            }}
        >
            <h1 className="text-3xl font-semibold">Verificar cuenta</h1>

            <p className="text-helper">
                Revisa tu correo e ingresa el código.
            </p>

            <input
                placeholder="Código"
                disabled={isLoading}
                className={inputClass}
                {...register("code", {
                    required: "Código requerido",
                })}
            />

            {errors.code && (
                <p className="text-danger text-sm">{errors.code.message}</p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
            >
                {isLoading ? "Verificando..." : "Verificar cuenta"}
            </button>
        </form>
    );
};
