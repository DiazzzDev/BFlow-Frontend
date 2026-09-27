import { MailCheck, ShieldCheck, Zap } from "lucide-react";

const steps = [
    {
        icon: MailCheck,
        title: "Revisa tu correo",
        description: "Enviamos un código de verificación de 6 dígitos.",
    },
    {
        icon: ShieldCheck,
        title: "Seguridad garantizada",
        description: "Tu cuenta queda resguardada mediante AWS Cognito.",
    },
    {
        icon: Zap,
        title: "Acceso inmediato",
        description: "Al confirmar, podrás iniciar sesión y tomar el control.",
    },
];

export const VerifyAccountHero = () => {
    return (
        <div className="flex flex-col gap-5 max-w-md">
            {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                    <div
                        key={index}
                        className="flex gap-4 items-start p-4 rounded-2xl border border-light-10 bg-surface/50 backdrop-blur-sm"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <IconComponent size={20} />
                        </div>
                        <div>
                            <h4 className="font-medium text-light text-sm">{step.title}</h4>
                            <p className="text-xs text-helper mt-0.5">{step.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
