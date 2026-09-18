import { PieChart } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SpendingCategory } from "../interfaces/dashboard";
import { dashboardCardClass, dashboardHeroClass, dashboardLabelClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { SegmentedBar } from "./SegmentedBar";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface SpendingCardProps {
    isLoading: boolean;
    totalSpent: number;
    currency: string;
    totalActivityPercentage: number;
    topCategories: SpendingCategory[];
}

export const SpendingCard = ({
    isLoading,
    totalActivityPercentage,
    topCategories,
}: SpendingCardProps) => {
    const { t } = useTranslation();
    const spendingPercent = formatPercentValue(totalActivityPercentage);
    const segments = topCategories.map((category) => ({
        label: category.categoryName,
        percent: category.percentage,
    }));

    return (
        <div className={dashboardCardClass}>
            <p className={dashboardLabelClass}>{t("dashboard.monthlyExpenses")}</p>

            <div className="mt-3 flex items-end gap-3">
                {isLoading ? (
                    <div className="h-10 w-20 shrink-0 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <p className={`shrink-0 ${dashboardHeroClass}`}>{spendingPercent}%</p>
                )}

                <div className="min-w-0 pb-1">
                    <p className="text-xs leading-tight text-helper">{t("dashboard.totalActivity")}</p>
                    {!isLoading && (
                        <p className="mt-0.5 text-xs leading-snug text-helper">
                            {t("dashboard.expensesShare", { percent: spendingPercent })}
                        </p>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="mt-5 h-2 w-full animate-pulse rounded-full bg-skeleton" />
            ) : topCategories.length === 0 ? (
                <CustomEmptyState
                    title={t("dashboard.noExpenses")}
                    description={t("dashboard.expensesHint")}
                    Icon={PieChart}
                    className="m-0! mt-4!"
                />
            ) : (
                <SegmentedBar segments={segments} showSegmentLabels />
            )}
        </div>
    );
};
