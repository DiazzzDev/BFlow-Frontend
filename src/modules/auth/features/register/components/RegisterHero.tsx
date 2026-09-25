import { Check, ShieldCheck, Zap, Users, TrendingUp } from "lucide-react";

const benefits = [
    {
        icon: Zap,
        color: "bg-primary/15 text-primary",
        text: "Registro en menos de 30 segundos",
        sub: "Sin tarjeta de crédito requerida",
    },
    {
        icon: ShieldCheck,
        color: "bg-success/15 text-success",
        text: "Tus datos siempre protegidos",
        sub: "Autenticación segura con AWS Cognito",
    },
    {
        icon: Users,
        color: "bg-info/15 text-info",
        text: "Billeteras compartidas",
        sub: "Invita miembros y gestiona en equipo",
    },
    {
        icon: TrendingUp,
        color: "bg-warning/15 text-warning",
        text: "Control financiero en tiempo real",
        sub: "Dashboard, presupuestos y más",
    },
];

export const RegisterHero = () => {
    return (
        <div className="flex flex-col gap-3 mt-4">
            {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                    <div
                        key={benefit.text}
                        className="flex items-center gap-3 rounded-xl border border-light-10 bg-light-5 px-4 py-3"
                    >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${benefit.color}`}>
                            <Icon size={15} />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">{benefit.text}</p>
                            <p className="text-[11px] text-helper mt-0.5">{benefit.sub}</p>
                        </div>
                        <Check size={13} className="ml-auto text-helper shrink-0" />
                    </div>
                );
            })}
        </div>
    );
};
