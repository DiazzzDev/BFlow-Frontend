import type { SpendingCategory } from "../interfaces/dashboard";

import { SegmentedBar } from "./SegmentedBar";

interface ThisMonthCardProps {
    isLoading: boolean;
    totalActivityPercentage: number; // fraccion 0-1
    topCategories: SpendingCategory[];
}

export const ThisMonthCard = ({
    isLoading,
    totalActivityPercentage,
    topCategories,
}: ThisMonthCardProps) => {
    const activityPercent = Math.round(totalActivityPercentage * 100);
    const segments = topCategories.map((category) => ({
        label: category.categoryName,
        percent: Math.round(category.percentage * 100),
    }));

    return (
        <div className="flex flex-col rounded-lg border border-light-10 bg-surface p-5">
            <p className="text-sm font-medium text-helper">This month</p>

            <div className="mt-3 flex items-baseline gap-2">
                {isLoading ? (
                    <div className="h-9 w-16 animate-pulse rounded-md bg-skeleton" />
                ) : (
                    <p className="text-3xl font-semibold tracking-tight text-light">
                        {activityPercent}%
                    </p>
                )}
                <span className="text-xs text-helper">Total activity</span>
            </div>

            {isLoading ? (
                <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-skeleton" />
            ) : (
                <SegmentedBar segments={segments} showLegend={false} />
            )}
        </div>
    );
};