import { ChevronRight } from "lucide-react";

import type { RecentActivityItem } from "../interfaces/dashboard";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

interface RecentActivityRowProps {
    activity: RecentActivityItem;
    currency: string;
}

export const RecentActivityRow = ({
    activity,
    currency,
}: RecentActivityRowProps) => {
    const isIncome = activity.type.toUpperCase() === "INCOME";

    return (
        <li className="flex items-center gap-3 border-b border-light-10 py-3.5 last:border-b-0">
            <div
                style={{
                    backgroundColor: `${activity.categoryColor}33`,
                    color: activity.categoryColor,
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
            >
                <CategoryIcon
                    icon={activity.categoryIcon}
                    className="h-4 w-4"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-col gap-1">
                    <p className="truncate text-sm font-medium text-light">
                        {activity.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="truncate text-[11px] font-medium text-light-75">
                        {activity.walletName}
                    </p>
                    <span className="truncate text-[9px] text-helper">•</span>
                    <p className="truncate text-[11px] text-helper">
                        {formatterDynamicDate(activity.createdAt)}
                    </p>
                </div>
            </div>

            <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${getTransactionAmountClassName(
                    activity.type,
                    activity.amount,
                )}`}
            >
                {isIncome ? "+ " : "- "}
                {formatCurrency(Math.abs(activity.amount), currency)}
            </p>

            <ChevronRight className="h-4 w-4 shrink-0 text-helper" />
        </li>
    );
};
