import type { SpendingCategory } from "../interfaces/dashboard";
import { dashboardCardClass, dashboardHeroClass, dashboardLabelClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { SegmentedBar } from "./SegmentedBar";

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
    const spendingPercent = formatPercentValue(totalActivityPercentage);
    const segments = topCategories.map((category) => ({
        label: category.categoryName,
        percent: category.percentage,
    }));

    return (
        <div className={dashboardCardClass}>
            <p className={dashboardLabelClass}>Spending this month</p>

            <div className="mt-3 flex items-end gap-3">
                {isLoading ? (
                    <div className="h-10 w-20 shrink-0 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <p className={`shrink-0 ${dashboardHeroClass}`}>{spendingPercent}%</p>
                )}

                <div className="min-w-0 pb-1">
                    <p className="text-xs leading-tight text-helper">Total activity</p>
                    {!isLoading && (
                        <p className="mt-0.5 text-xs leading-snug text-helper">
                            {spendingPercent}% of your money movement was spending
                        </p>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="mt-5 h-2 w-full animate-pulse rounded-full bg-skeleton" />
            ) : (
                <SegmentedBar segments={segments} showSegmentLabels />
            )}
        </div>
    );
};
