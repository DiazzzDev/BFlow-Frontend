import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import type { RecentActivityItem } from "../interfaces/dashboard";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface RecentActivityRowProps {
    activity: RecentActivityItem;
    currency: string;
}

// TODO: confirmar el enum real de "type" que manda el backend.
const isIncomeType = (type: string) => type.toUpperCase() === "INCOME";

export const RecentActivityRow = ({ activity, currency }: RecentActivityRowProps) => {
    const isIncome = isIncomeType(activity.type);

    return (
        <li className="flex items-center gap-3 border-b border-light-10 py-3 last:border-b-0">
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isIncome ? "bg-success-sweet text-success" : "bg-danger-sweet text-danger"
                }`}
            >
                {isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-light">{activity.name}</p>
                <p className="truncate text-xs text-helper">
                    {activity.walletName} · {formatterDynamicDate(activity.createdAt)}
                </p>
            </div>

            <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                    isIncome ? "text-success" : "text-danger"
                }`}
            >
                {isIncome ? "+" : "-"}
                {formatCurrency(Math.abs(activity.amount), currency)}
            </p>
        </li>
    );
};