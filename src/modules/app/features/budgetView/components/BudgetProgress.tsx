import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface BudgetProgressProps {
    percent: number;
    warning?: number;
    critical?: number;
    spent?: number;
    budgetLimit?: number;
    currency?: string;
}

export const BudgetProgress = ({
    percent,
    warning = 60,
    critical = 90,
    spent = 0,
    budgetLimit = 0,
    currency,
}: BudgetProgressProps) => {
    const clamped = Math.min(Math.max(percent, 0), 100);
    const fillClass =
        clamped >= critical
            ? "bg-danger"
            : clamped >= warning
                ? "bg-warning"
                : "bg-primary";

    return (
        <article className="rounded-2xl border border-light-10 bg-surface p-6 shadow-custom">
            <div className="mb-5 flex items-end justify-between gap-4">
                <p className="text-base font-semibold text-light">Progreso del presupuesto</p>
                <p className="shrink-0 text-3xl font-semibold tabular-nums tracking-tight text-light">
                    {clamped.toFixed(0)}%
                </p>
            </div>

            <div className="relative h-2.5 overflow-visible rounded-full bg-secondary">
                <div className="h-2.5 overflow-hidden rounded-full">
                    <div
                        className={`h-full rounded-full transition-all ${fillClass}`}
                        style={{ width: `${clamped}%` }}
                    />
                </div>
                <span
                    className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-warning"
                    style={{ left: `${Math.min(Math.max(warning, 0), 100)}%` }}
                    title={`Alerta ${warning}%`}
                />
                <span
                    className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-danger"
                    style={{ left: `${Math.min(Math.max(critical, 0), 100)}%` }}
                    title={`Crítico ${critical}%`}
                />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="text-xs text-helper">
                    Alerta {warning}% · Crítico {critical}%
                </p>
                <p className="shrink-0 text-right text-lg font-semibold tabular-nums tracking-tight text-light">
                    {formatCurrency(spent, currency)}
                    <span className="font-medium text-helper">
                        {" "}/ {formatCurrency(budgetLimit, currency)}
                    </span>
                </p>
            </div>
        </article>
    );
};
