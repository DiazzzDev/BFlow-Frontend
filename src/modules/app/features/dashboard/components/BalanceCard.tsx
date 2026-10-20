import { useTranslation } from "react-i18next";

import { dashboardCardClass, dashboardLabelClass } from "../utils/dashboardCard";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

import { AmountDisplay } from "./AmountDisplay";

interface BalanceCardProps {
    isLoading: boolean;
    total: number;
    currency: string;
    averageIncome: number;
    averageExpenses: number;
}

export const BalanceCard = ({
    isLoading,
    total,
    currency,
    averageIncome,
    averageExpenses,
}: BalanceCardProps) => {
    const { t } = useTranslation();

    return (
        <section className={dashboardCardClass}>
            <div className="flex items-center justify-between gap-3">
                <p className={dashboardLabelClass}>{t("dashboard.currentBalance")}</p>
            </div>

            {isLoading ? (
                <div className="mt-5 h-14 w-56 animate-pulse rounded-lg bg-skeleton" />
            ) : (
                <div className="mt-4">
                    <AmountDisplay amount={total} currency={currency} />
                </div>
            )}

            <div className="my-5 border-t border-light-10" />

            <p className="text-xs text-helper">{t("dashboard.monthlySummary")}</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:divide-x sm:divide-light-10">
                <div className="flex items-center justify-between gap-3 sm:pr-4">
                    <p className="text-sm text-light">{t("dashboard.income")}</p>
                    {isLoading ? (
                        <div className="mt-2 h-7 w-28 animate-pulse rounded-md bg-skeleton" />
                    ) : (
                        <p className="text-lg font-semibold tabular-nums text-info sm:text-xl">
                            +{formatCurrency(averageIncome, currency)}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-between gap-3 sm:pl-4">
                    <p className="text-sm text-light">{t("dashboard.expenses")}</p>
                    {isLoading ? (
                        <div className="mt-2 h-7 w-28 animate-pulse rounded-md bg-skeleton" />
                    ) : (
                        <p className="text-lg font-semibold tabular-nums text-danger sm:text-xl">
                            -{formatCurrency(averageExpenses, currency)}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
