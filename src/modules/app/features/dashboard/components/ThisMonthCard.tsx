import type { SpendingCategory } from "../interfaces/dashboard";
import { dashboardCardClass } from "../utils/dashboardCard";
import { formatPercentValue } from "../utils/formatPercent";

import { SegmentedBar } from "./SegmentedBar";

interface ThisMonthCardProps {
    isLoading: boolean;
    totalActivityPercentage: number;
    topCategories: SpendingCategory[];
}

export const ThisMonthCard = ({
    isLoading,
    totalActivityPercentage,
    topCategories,
}: ThisMonthCardProps) => {
    const activityPercent = formatPercentValue(totalActivityPercentage);
    const segments = topCategories.map((category) => ({
        label: category.categoryName,
        percent: category.percentage,
    }));

    return (
        <div className={`${dashboardCardClass} min-h-36 justify-between`}>
            <p className="text-sm font-medium text-helper">This month</p>

            <div className="mt-4 flex items-baseline gap-2">
                {isLoading ? (
                    <div className="h-10 w-16 animate-pulse rounded-lg bg-skeleton" />
                ) : (
                    <p className="text-4xl font-semibold tracking-tight text-light">
                        {activityPercent}%
                    </p>
                )}
                <span className="text-sm text-helper">Total activity</span>
            </div>

            {isLoading ? (
                <div className="mt-6 h-3 w-full animate-pulse rounded-full bg-skeleton" />
            ) : (
                <SegmentedBar segments={segments} showLegend={false} />
            )}
        </div>
    );
};
