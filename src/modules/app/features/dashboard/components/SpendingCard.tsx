import type { SpendingCategory } from "../interfaces/dashboard";
import { dashboardCardClass } from "../utils/dashboardCard";
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
            <p className="text-sm font-medium text-light">Spending this month</p>

            <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
                {isLoading ? (
                    <div className="h-10 w-16 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <p className="text-4xl font-semibold tracking-tight text-light">
                        {spendingPercent}%
                    </p>
                )}

                <div className="flex flex-col gap-0.5 pb-1">
                    <span className="text-sm text-helper">Total activity</span>
                    {!isLoading && (
                        <p className="text-sm text-helper">
                            {spendingPercent}% of your money movement was spending
                        </p>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-skeleton" />
            ) : (
                <SegmentedBar segments={segments} showSegmentLabels />
            )}
        </div>
    );
};
