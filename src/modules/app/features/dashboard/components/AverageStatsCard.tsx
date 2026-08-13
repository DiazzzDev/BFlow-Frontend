import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface AverageRowProps {
    isLoading: boolean;
    label: string;
    amount: number;
    currency: string;
    percentageChangeLastMonth: number; // fraccion 0-1
}

const AverageRow = ({
    isLoading,
    label,
    amount,
    currency,
    percentageChangeLastMonth,
}: AverageRowProps) => {
    const changePercent = Math.round(percentageChangeLastMonth * 100 * 10) / 10;
    const isPositive = changePercent >= 0;

    return (
        <div>
            <p className="text-sm font-medium text-helper">{label}</p>

            {isLoading ? (
                <div className="mt-2 h-8 w-32 animate-pulse rounded-md bg-skeleton" />
            ) : (
                <p className="mt-1 text-2xl font-semibold tracking-tight text-light">
                    {formatCurrency(amount, currency)}
                </p>
            )}

            {!isLoading && (
                <p className="mt-1 text-xs text-helper">
                    <span className={isPositive ? "text-success" : "text-danger"}>
                        {isPositive ? "+" : ""}
                        {changePercent}%
                    </span>{" "}
                    compared to last month
                </p>
            )}
        </div>
    );
};

interface AverageStatsCardProps {
    isLoading: boolean;
    currency: string;
    averageIncome: number;
    incomePercentageChangeLastMonth: number;
    averageExpenses: number;
    expensesPercentageChangeLastMonth: number;
}

export const AverageStatsCard = ({
    isLoading,
    currency,
    averageIncome,
    incomePercentageChangeLastMonth,
    averageExpenses,
    expensesPercentageChangeLastMonth,
}: AverageStatsCardProps) => {
    return (
        <div className="flex flex-col justify-center gap-5 rounded-lg border border-light-10 bg-surface p-5">
            <AverageRow
                isLoading={isLoading}
                label="Average income"
                amount={averageIncome}
                currency={currency}
                percentageChangeLastMonth={incomePercentageChangeLastMonth}
            />
            <div className="border-t border-light-10" />
            <AverageRow
                isLoading={isLoading}
                label="Average expenses"
                amount={averageExpenses}
                currency={currency}
                percentageChangeLastMonth={expensesPercentageChangeLastMonth}
            />
        </div>
    );
};