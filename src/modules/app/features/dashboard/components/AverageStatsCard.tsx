import { dashboardCardClass, dashboardLabelClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";
import { useTranslation } from "react-i18next";

import { AmountDisplay } from "./AmountDisplay";

interface AverageRowProps {
    isLoading: boolean;
    label: string;
    amount: number;
    currency: string;
    percentageChangeLastMonth: number;
    changeTone: "info" | "danger";
}

const AverageRow = ({
    isLoading,
    label,
    amount,
    currency,
    percentageChangeLastMonth,
    changeTone,
}: AverageRowProps) => {
    const { t } = useTranslation();
    const changePercent = formatPercentValue(percentageChangeLastMonth);
    const isPositive = percentageChangeLastMonth >= 0;
    const toneClass = changeTone === "info" ? "text-info" : "text-danger";

    return (
        <div className="flex flex-col">
            <p className={dashboardLabelClass}>{label}</p>

            {isLoading ? (
                <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-skeleton" />
            ) : (
                <AmountDisplay amount={amount} currency={currency} />
            )}

            {!isLoading && (
                <p className="mt-1.5 text-sm text-helper">
                    <span className={`font-medium ${toneClass}`}>
                        {isPositive ? "+" : ""}
                        {changePercent}%
                    </span>
                    {" "}
                    {t("dashboard.vsLastMonth")}
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
    const { t } = useTranslation();
    return (
        <div className={`${dashboardCardClass} gap-5`}>
            <AverageRow
                isLoading={isLoading}
                label={t("dashboard.averageIncome")}
                amount={averageIncome}
                currency={currency}
                percentageChangeLastMonth={incomePercentageChangeLastMonth}
                changeTone="info"
            />
            <div className="border-t border-light-10" />
            <AverageRow
                isLoading={isLoading}
                label={t("dashboard.averageExpense")}
                amount={averageExpenses}
                currency={currency}
                percentageChangeLastMonth={expensesPercentageChangeLastMonth}
                changeTone="danger"
            />
        </div>
    );
};
