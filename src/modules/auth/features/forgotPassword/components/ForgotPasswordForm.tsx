import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "El correo es requerido")
        .email("Correo inválido"),
});

type FormData = z.infer<typeof forgotPasswordSchema>;

const inputClass =
    "h-10 w-full rounded-lg border border-light-10 bg-surface px-3 text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

interface ForgotPasswordFormProps {
    onSubmit: (email: string) => Promise<unknown>;
    isLoading: boolean;
}

export const ForgotPasswordForm = ({ onSubmit, isLoading }: ForgotPasswordFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
    });

    return (
        <form
            className="w-full max-w-md space-y-4"
            onSubmit={(e) => {
                void handleSubmit((data) => onSubmit(data.email))(e);
            }}
        >
            <h1 className="text-3xl font-semibold">Recuperar contraseña</h1>

            <p className="text-helper">
                Te enviaremos un código de recuperación.
            </p>

            <input
                placeholder="Correo electrónico"
                disabled={isLoading}
                className={inputClass}
                {...register("email")}
            />

            {errors.email && (
                <p className="text-danger text-sm">{errors.email.message}</p>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer"
            >
                {isLoading ? "Enviando..." : "Enviar código"}
            </button>
        </form>
    );
};
