import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface BalanceCardProps {
    isLoading: boolean;
    total: number;
    currency: string;
    percentageChangeLastMonth: number; // fraccion 0-1, ej 0.084 = 8.4%
}

export const BalanceCard = ({
    isLoading,
    total,
    currency,
    percentageChangeLastMonth,
}: BalanceCardProps) => {
    const changePercent = Math.round(percentageChangeLastMonth * 100 * 10) / 10;
    const isPositive = changePercent >= 0;

    return (
        <div className="flex flex-col justify-between rounded-lg border border-light-10 bg-surface p-5">
            <p className="text-sm font-medium text-helper">Balance total</p>

            {isLoading ? (
                <div className="mt-3 h-9 w-40 animate-pulse rounded-md bg-skeleton" />
            ) : (
                <p className="mt-3 text-3xl font-semibold tracking-tight text-light">
                    {formatCurrency(total, currency)}
                </p>
            )}

            {isLoading ? (
                <div className="mt-3 h-4 w-48 animate-pulse rounded-md bg-skeleton" />
            ) : (
                <p className="mt-3 text-xs text-helper">
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