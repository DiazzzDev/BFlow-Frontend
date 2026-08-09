import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { SkeletonText } from "@/components/loaders/SkeletonText";

interface BudgetOverviewProps {
    totalBudgets: number;
    totalLimit: number;
    isLoading?: boolean;
}

export const BudgetOverview = ({
    totalBudgets,
    totalLimit,
    isLoading = false,
}: BudgetOverviewProps) => {
    return (
        <section className="mb-6 sm:mb-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <article className="rounded-2xl border border-light-10 bg-surface px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-sm text-helper">Active budgets</p>
                    {isLoading ? (
                        <SkeletonText className="mt-3 h-8 w-16" />
                    ) : (
                        <p className="mt-2 text-2xl font-semibold tabular-nums text-light sm:text-3xl">
                            {totalBudgets}
                        </p>
                    )}
                </article>

                <article className="rounded-2xl border border-light-10 bg-surface px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-sm text-helper">Total budget limit</p>
                    {isLoading ? (
                        <SkeletonText className="mt-3 h-8 w-28" />
                    ) : (
                        <p className="mt-2 text-2xl font-semibold tabular-nums text-light sm:text-3xl">
                            {formatCurrency(totalLimit)}
                        </p>
                    )}
                </article>
            </div>
        </section>
    );
};
