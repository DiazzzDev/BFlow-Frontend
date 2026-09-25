import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

// ── Step schemas ─────────────────────────────────────────────
const step1Schema = z.object({
    email: z
        .string()
        .min(1, "El correo es requerido")
        .email("Correo inválido"),
});

const step2Schema = z
    .object({
        code: z.string().min(1, "El código es requerido"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

// ── Props ─────────────────────────────────────────────────────
interface ForgotPasswordFormProps {
    onRequestCode: (email: string) => Promise<unknown>;
    onConfirmReset: (args: {
        email: string;
        code: string;
        password: string;
    }) => Promise<unknown>;
    isRequestingCode: boolean;
    isConfirming: boolean;
}

// ── Sub-components ───────────────────────────────────────────
const StepIndicator = ({ current }: { current: 1 | 2 | 3 }) => (
    <div className="flex items-center gap-2 mb-6">
        {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
                <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                        s < current
                            ? "bg-primary text-light"
                            : s === current
                            ? "border-2 border-primary text-primary"
                            : "border border-light-10 text-helper"
                    }`}
                >
                    {s < current ? "✓" : s}
                </div>
                {s < 3 && (
                    <div
                        className={`h-px w-8 transition-all duration-500 ${
                            s < current ? "bg-primary" : "bg-light-10"
                        }`}
                    />
                )}
            </div>
        ))}
    </div>
);

const inputBase =
    "h-11 w-full rounded-xl border bg-surface text-light placeholder:text-placeholder outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 transition-all duration-150";
const inputNormal = `${inputBase} border-light-10 focus:border-primary/50`;
const inputErr = `${inputBase} border-danger/60 focus:ring-danger/40`;

// ── Main component ───────────────────────────────────────────
export const ForgotPasswordForm = ({
    onRequestCode,
    onConfirmReset,
    isRequestingCode,
    isConfirming,
}: ForgotPasswordFormProps) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Step 1 form
    const {
        register: r1,
        handleSubmit: hs1,
        formState: { errors: e1, isSubmitted: s1 },
    } = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });

    // Step 2 form
    const {
        register: r2,
        handleSubmit: hs2,
        formState: { errors: e2 },
    } = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

    // ── Handlers ───────────────────────────────────────────
    const handleStep1 = async (data: Step1Data) => {
        try {
            await onRequestCode(data.email);
            setEmail(data.email);
            setStep(2);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error al enviar el código");
        }
    };

    const handleStep2 = async (data: Step2Data) => {
        try {
            await onConfirmReset({ email, code: data.code, password: data.password });
            setStep(3);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Código inválido o expirado");
        }
    };

    // ── Step 1: Email ──────────────────────────────────────
    if (step === 1) {
        return (
            <div className="w-full">
                <StepIndicator current={1} />

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-1">Recuperar contraseña</h1>
                    <p className="text-sm text-helper">
                        Ingresa tu correo y te enviaremos un código de verificación.
                    </p>
                </div>

                <form
                    onSubmit={(e) => { void hs1(handleStep1)(e); }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-label" htmlFor="fp-email">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper" />
                            <input
                                id="fp-email"
                                placeholder="tu@correo.com"
                                disabled={isRequestingCode}
                                aria-invalid={s1 && !!e1.email}
                                {...r1("email")}
                                className={`${s1 && e1.email ? inputErr : inputNormal} pl-10`}
                            />
                        </div>
                        {s1 && e1.email && (
                            <p className="text-xs text-danger">{e1.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isRequestingCode}
                        className="h-11 w-full rounded-xl bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-40 cursor-pointer transition-colors duration-200 inline-flex items-center justify-center gap-2"
                    >
                        {isRequestingCode ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Enviando código...
                            </>
                        ) : (
                            "Enviar código"
                        )}
                    </button>

                    <p className="text-center text-xs text-helper">
                        <Link to="/auth/login" className="text-primary hover:opacity-75 font-medium">
                            Volver al inicio de sesión
                        </Link>
                    </p>
                </form>
            </div>
        );
    }

    // ── Step 2: Code + New Password ────────────────────────
    if (step === 2) {
        return (
            <div className="w-full">
                <StepIndicator current={2} />

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-1">Nueva contraseña</h1>
                    <p className="text-sm text-helper">
                        Revisa <span className="text-light font-medium">{email}</span> e ingresa el código recibido.
                    </p>
                </div>

                <form
                    onSubmit={(e) => { void hs2(handleStep2)(e); }}
                    className="space-y-4"
                >
                    {/* Code */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-label" htmlFor="fp-code">
                            Código de verificación
                        </label>
                        <div className="relative">
                            <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper" />
                            <input
                                id="fp-code"
                                placeholder="123456"
                                disabled={isConfirming}
                                aria-invalid={!!e2.code}
                                autoComplete="one-time-code"
                                {...r2("code")}
                                className={`${e2.code ? inputErr : inputNormal} pl-10 tracking-widest`}
                            />
                        </div>
                        {e2.code && (
                            <p className="text-xs text-danger">{e2.code.message}</p>
                        )}
                    </div>

                    {/* New password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-label" htmlFor="fp-password">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper" />
                            <input
                                id="fp-password"
                                type={showPwd ? "text" : "password"}
                                placeholder="Mínimo 8 caracteres"
                                disabled={isConfirming}
                                aria-invalid={!!e2.password}
                                {...r2("password")}
                                className={`${e2.password ? inputErr : inputNormal} px-10`}
                            />
                            <button
                                type="button"
                                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-helper hover:text-light transition-colors"
                                onClick={() => setShowPwd(!showPwd)}
                            >
                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {e2.password && (
                            <p className="text-xs text-danger">{e2.password.message}</p>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-label" htmlFor="fp-confirm">
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-helper" />
                            <input
                                id="fp-confirm"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repite tu nueva contraseña"
                                disabled={isConfirming}
                                aria-invalid={!!e2.confirmPassword}
                                {...r2("confirmPassword")}
                                className={`${e2.confirmPassword ? inputErr : inputNormal} px-10`}
                            />
                            <button
                                type="button"
                                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-helper hover:text-light transition-colors"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {e2.confirmPassword && (
                            <p className="text-xs text-danger">{e2.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isConfirming}
                        className="h-11 w-full rounded-xl bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-40 cursor-pointer transition-colors duration-200 inline-flex items-center justify-center gap-2"
                    >
                        {isConfirming ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            "Actualizar contraseña"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-helper hover:text-light transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={12} />
                        Cambiar correo
                    </button>
                </form>
            </div>
        );
    }

    // ── Step 3: Success ─────────────────────────────────────
    return (
        <div className="w-full">
            <StepIndicator current={3} />

            <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15">
                    <CheckCircle2 size={32} className="text-success" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold mb-1">¡Contraseña actualizada!</h1>
                    <p className="text-sm text-helper max-w-xs">
                        Tu contraseña fue cambiada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
                    </p>
                </div>
                <Link
                    to="/auth/login"
                    className="mt-2 h-11 w-full max-w-xs rounded-xl bg-primary text-light font-medium hover:bg-primary-dark transition-colors duration-200 inline-flex items-center justify-center"
                >
                    Ir al inicio de sesión
                </Link>
            </div>
        </div>
    );
};
