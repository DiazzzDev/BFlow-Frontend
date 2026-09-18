import { dashboardCardClass, dashboardLabelClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";
import { useTranslation } from "react-i18next";

import { AmountDisplay } from "./AmountDisplay";

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
    const { t } = useTranslation();
    const changePercent = formatPercentValue(percentageChangeLastMonth);
    const isPositive = percentageChangeLastMonth >= 0;

    return (
        <div className={dashboardCardClass}>
            <p className={dashboardLabelClass}>{t("dashboard.totalBalance")}</p>

            {isLoading ? (
                <div className="mt-3 h-10 w-44 animate-pulse rounded-lg bg-skeleton" />
            ) : (
                <AmountDisplay amount={total} currency={currency} />
            )}

            {isLoading ? (
                <div className="mt-2 h-4 w-52 animate-pulse rounded-md bg-skeleton" />
            ) : (
                <p className="mt-2 text-sm text-helper">
                    <span className={isPositive ? "text-success" : "text-danger"}>
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
