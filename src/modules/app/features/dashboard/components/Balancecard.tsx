
import { dashboardCardClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface BalanceCardProps {
    isLoading: boolean;
    total: number;
    currency: string;
    percentageChangeLastMonth: number;
}

export const BalanceCard = ({
    isLoading,
    total,
    currency,
    percentageChangeLastMonth,
}: BalanceCardProps) => {
    const changePercent = formatPercentValue(percentageChangeLastMonth);
    const isPositive = percentageChangeLastMonth >= 0;

    return (
        <div className={`${dashboardCardClass} justify-between min-h-36`}>
            <p className="text-sm font-medium text-helper">Balance total</p>

            {isLoading ? (
                <div className="mt-4 h-10 w-44 animate-pulse rounded-lg bg-skeleton" />
            ) : (
                <p className="mt-4 text-4xl font-semibold tracking-tight text-light">
                    {formatCurrency(total, currency)}
                </p>
            )}

            {isLoading ? (
                <div className="mt-4 h-4 w-52 animate-pulse rounded-md bg-skeleton" />
            ) : (
                <p className="mt-4 text-sm text-helper">
                    <span className={isPositive ? "text-success" : "text-danger"}>
                        {isPositive ? "+ " : ""}
                        {changePercent}%
                    </span>{" "}
                    compared to last month
                </p>
            )}
        </div>
    );
};
