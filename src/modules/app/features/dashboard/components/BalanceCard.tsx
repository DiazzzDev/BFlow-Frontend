import { useTranslation } from "react-i18next";

import {
    dashboardCardClass,
    dashboardLabelClass,
} from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { AmountDisplay } from "./AmountDisplay";

interface BalanceCardProps {
    isLoading: boolean;
    total: number;
    currency: string;
    percentageChangeLastMonth: number;
    averageIncome: number;
    averageExpenses: number;
}

export const BalanceCard = ({
    isLoading,
    total,
    currency,
    percentageChangeLastMonth,
    averageIncome,
    averageExpenses,
}: BalanceCardProps) => {
    const { t } = useTranslation();

    // Shared % change label for the three balance columns
    const changePercent = formatPercentValue(percentageChangeLastMonth);
    const isPositive = percentageChangeLastMonth >= 0;

    return (
        <div className={`${dashboardCardClass} flex-row gap-14`}>
            <div className="flex flex-col">
                <p className={dashboardLabelClass}>
                    {t("dashboard.totalBalance")}
                </p>

                {isLoading ? (
                    <div className="mt-3 h-10 w-44 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <AmountDisplay amount={total} currency={currency} />
                )}

                {isLoading ? (
                    <div className="mt-2 h-4 w-52 animate-pulse rounded-md bg-skeleton" />
                ) : (
                    <p className="mt-2 text-sm text-helper">
                        <span
                            className={
                                isPositive ? "text-success" : "text-danger"
                            }
                        >
                            {isPositive ? "+" : ""}
                            {changePercent}%
                        </span>{" "}
                        {t("dashboard.vsLastMonth")}
                    </p>
                )}
            </div>

            <div className="flex flex-col">
                <p className={dashboardLabelClass}>
                    {t("dashboard.averageIncome")}
                </p>

                {isLoading ? (
                    <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <AmountDisplay amount={averageIncome} currency={currency} />
                )}

                {!isLoading && (
                    <p className="mt-1.5 text-sm text-helper">
                        <span className="font-medium text-info">
                            {isPositive ? "+" : ""}
                            {changePercent}%
                        </span>{" "}
                        {t("dashboard.vsLastMonth")}
                    </p>
                )}
            </div>

            <div className="flex flex-col">
                <p className={dashboardLabelClass}>
                    {t("dashboard.averageExpense")}
                </p>

                {isLoading ? (
                    <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <AmountDisplay
                        amount={averageExpenses}
                        currency={currency}
                    />
                )}

                {!isLoading && (
                    <p className="mt-1.5 text-sm text-helper">
                        <span className="font-medium text-danger">
                            {isPositive ? "+" : ""}
                            {changePercent}%
                        </span>{" "}
                        {t("dashboard.vsLastMonth")}
                    </p>
                )}
            </div>
        </div>
    );
};
