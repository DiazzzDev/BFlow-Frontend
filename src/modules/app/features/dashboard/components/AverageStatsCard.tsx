import { formatCurrency } from "@/utils/formatters/formatCurrency";

import { dashboardCardClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

interface AverageRowProps {
    isLoading: boolean;
    label: string;
    amount: number;
    currency: string;
    percentageChangeLastMonth: number;
    changeTone: "info" | "danger";
}

const AmountDisplay = ({ amount, currency }: { amount: number; currency: string }) => {
    const formatted = formatCurrency(amount, currency);
    const decimalIndex = formatted.lastIndexOf(".");

    if (decimalIndex === -1) {
        return (
            <p className="mt-3 text-4xl font-semibold tracking-tight text-light @3xl:text-5xl">
                {formatted}
            </p>
        );
    }

    const whole = formatted.slice(0, decimalIndex);
    const cents = formatted.slice(decimalIndex);

    return (
        <p className="mt-3 text-3xl font-semibold tracking-tight text-light @3xl:text-4xl">
            {whole}
            <span className="text-xl font-semibold @3xl:text-2xl">{cents}</span>
        </p>
    );
};

const AverageRow = ({
    isLoading,
    label,
    amount,
    currency,
    percentageChangeLastMonth,
    changeTone,
}: AverageRowProps) => {
    const changePercent = formatPercentValue(percentageChangeLastMonth);
    const isPositive = percentageChangeLastMonth >= 0;
    const toneClass = changeTone === "info" ? "text-info" : "text-danger";

    return (
        <div className="flex flex-1 flex-col justify-center">
            <p className="text-base font-medium text-helper">{label}</p>

            {isLoading ? (
                <div className="mt-3 h-12 w-48 animate-pulse rounded-lg bg-skeleton" />
            ) : (
                <AmountDisplay amount={amount} currency={currency} />
            )}

            {!isLoading && (
                <p className="mt-3 text-base text-helper">
                    <span className={`font-semibold ${toneClass}`}>
                        {isPositive ? "+" : ""}
                        {changePercent}%
                    </span>
                    {" "}
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
        <div className={`${dashboardCardClass} h-full min-h-72 justify-evenly gap-8`}>
            <AverageRow
                isLoading={isLoading}
                label="Average income"
                amount={averageIncome}
                currency={currency}
                percentageChangeLastMonth={incomePercentageChangeLastMonth}
                changeTone="info"
            />
            <div className="border-t border-light-10" />
            <AverageRow
                isLoading={isLoading}
                label="Average expenses"
                amount={averageExpenses}
                currency={currency}
                percentageChangeLastMonth={expensesPercentageChangeLastMonth}
                changeTone="danger"
            />
        </div>
    );
};
