import { Check } from "lucide-react"

const benefits = [
    "Hasta 2 billeteras en el plan gratuito",
    "Gastos e ingresos ilimitados",
    "Categorización automática con IA",
    "Puedes mejorar tu plan cuando quieras",
]

export const RegisterHero = () => {
    return (
        <div className="flex flex-col gap-5">
            {benefits.map((benefit, index) => (
                <div className="flex gap-3 items-center" key={index}>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/20">
                        <Check size={15} />
                    </div>
                    <span className="text-text-muted">
                        {benefit}
                    </span>
                </div>
            ))}
        </div>
    )
}