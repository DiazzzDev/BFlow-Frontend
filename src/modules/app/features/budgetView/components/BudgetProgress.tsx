interface BudgetProgressProps {
    percent: number;
}

export const BudgetProgress = ({ percent }: BudgetProgressProps) => {
    const clamped = Math.min(Math.max(percent, 0), 100);

    return (
        <article className="rounded-2xl border border-light-10 bg-surface px-5 py-5">
            <p className="text-sm font-medium text-light mb-4">Budget Progress</p>

            <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${clamped}%` }}
                    />
                </div>
                <p className="text-2xl font-semibold text-light tabular-nums shrink-0">
                    {clamped.toFixed(2)}%
                </p>
            </div>
        </article>
    );
};
