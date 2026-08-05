interface BudgetOverviewProps {
    improvementPercent: number;
    fromAmount: string;
    toAmount: string;
}

export const BudgetOverview = ({
    improvementPercent,
    fromAmount,
    toAmount,
}: BudgetOverviewProps) => {
    return (
        <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <article className="rounded-2xl border border-light-10 bg-surface px-6 py-5 flex items-center justify-between gap-6">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-light leading-relaxed">
                            Your financial health has improved by {improvementPercent}%
                        </p>
                        <p className="text-sm text-helper mt-2">
                            Your total spending is lower than last month
                        </p>
                        <p className="text-sm text-helper mt-1">
                            {fromAmount}
                            {" -> "}
                            {toAmount}
                        </p>
                    </div>

                    <p className="text-4xl font-semibold text-light tabular-nums shrink-0">
                        {improvementPercent}%
                    </p>
                </article>

                <article className="rounded-2xl border border-light-10 bg-surface min-h-32" />
            </div>
        </section>
    );
};
