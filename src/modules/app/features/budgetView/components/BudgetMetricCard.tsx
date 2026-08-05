interface BudgetMetricCardProps {
    title: string;
    value: string;
    subtitle?: string;
}

export const BudgetMetricCard = ({ title, value, subtitle }: BudgetMetricCardProps) => {
    return (
        <article className="rounded-2xl border border-light-10 bg-surface px-5 py-4 h-35">
            <p className="text-sm text-helper">{title}</p>
            <p className="text-2xl font-semibold text-light mt-2 tabular-nums">{value}</p>
            {subtitle && (
                <p className="text-sm text-helper mt-1">{subtitle}</p>
            )}
        </article>
    );
};
