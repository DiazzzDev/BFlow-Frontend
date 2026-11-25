
import { ChevronRight } from "lucide-react";

import type { RecentActivityItem } from "../interfaces/dashboard";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

interface RecentActivityRowProps {
    activity: RecentActivityItem;
    isToday: boolean;
    onClick: (activity: RecentActivityItem) => void;
}

export const RecentActivityRow = ({
    activity,
    isToday,
    onClick,
}: RecentActivityRowProps) => {
    const isIncome = activity.type.toUpperCase() === "INCOME";
    const categoryColor = activity.categoryColor ?? "#64748B";

    return (
        <li className="border-b border-light-10 last:border-b-0">
            <button
                type="button"
                data-testid="recent-activity-row"
                onClick={() => onClick(activity)}
                className="flex w-full min-w-0 items-center gap-2 rounded-lg p-2.5 text-left transition-colors hover:bg-light-5 sm:gap-3 sm:px-2"
            >
                {/* Category icon */}
                <div
                    style={{
                        backgroundColor: `${categoryColor}33`,
                        color: categoryColor,
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
                >
                    <CategoryIcon
                        icon={activity.categoryIcon}
                        className="h-4 w-4"
                    />
                </div>

                {/* Activity information */}
                <div className="min-w-0 flex-1">
                    <p className="break-words text-xs sm:text-sm font-medium text-light sm:truncate">
                        {activity.name}
                    </p>

                    <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="max-w-full break-words text-[11px] font-medium text-light-75 sm:truncate">
                            {activity.walletName}
                        </p>

                        {isToday && (
                            <>
                                <span className="text-[9px] text-helper">•</span>
                                <p className="text-[11px] text-helper">
                                    {formatterDynamicDate(activity.createdAt)}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Transaction amount and navigation */}
                <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <p
                        className={`whitespace-nowrap text-right text-xs font-semibold tabular-nums min-[360px]:text-sm ${getTransactionAmountClassName(
                            activity.type,
                            activity.amount,
                        )}`}
                    >
                        {isIncome ? "+ " : "- "}
                        {formatCurrency(
                            Math.abs(activity.amount),
                            activity.currency,
                        )}
                    </p>

                    <ChevronRight className="h-4 w-4 shrink-0 text-helper" />
                </div>
            </button>
        </li>
    );
};
