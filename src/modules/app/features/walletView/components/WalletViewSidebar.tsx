import { ArrowDownLeft, ArrowUpRight, CalendarClock } from "lucide-react";

import type { UpcomingTransaction } from "../interfaces/Transaction";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

export interface WalletViewSidebarProps {
    lastActivity: string;
    highestExpense: string;
    transactionsCount: number;
    initialValue: number;
    currency: string;
    upcoming: UpcomingTransaction[];
    onSchedule?: () => void;
    isLoading?: boolean;
    className?: string;
}

const infoSkeletonRows = [
    { labelClassName: "h-3.5 w-20", valueClassName: "h-3.5 w-24" },
    { labelClassName: "h-3.5 w-28", valueClassName: "h-3.5 w-16" },
    { labelClassName: "h-3.5 w-24", valueClassName: "h-3.5 w-10" },
    { labelClassName: "h-3.5 w-20", valueClassName: "h-3.5 w-20" },
];

const upcomingSkeletonRows = [
    { titleClassName: "h-3.5 w-32", dateClassName: "h-3.5 w-14" },
    { titleClassName: "h-3.5 w-24", dateClassName: "h-3.5 w-20" },
    { titleClassName: "h-3.5 w-36", dateClassName: "h-3.5 w-16" },
];

export const WalletViewSidebar = ({
    lastActivity,
    highestExpense,
    transactionsCount,
    initialValue,
    currency,
    upcoming,
    onSchedule,
    isLoading = false,
    className = "",
}: WalletViewSidebarProps) => {
    return (
        <aside
            className={`flex flex-col gap-8 px-6 py-5 ${className}`}
        >
            <section>
                <h2 className="mb-5 text-xl font-semibold text-light">Information</h2>
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {infoSkeletonRows.map((row) => (
                            <div
                                key={row.labelClassName}
                                className="flex items-center justify-between gap-3"
                            >
                                <SkeletonText className={row.labelClassName} />
                                <SkeletonText className={row.valueClassName} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <dl className="flex flex-col gap-4">
                        <InfoRow label="Last activity" value={formatterDynamicDate(lastActivity) || "—"} />
                        <InfoRow label="Highest expense" value={highestExpense} />
                        <InfoRow label="Transactions" value={String(transactionsCount)} />
                        <InfoRow
                            label="Initial value"
                            value={formatCurrency(initialValue, currency)}
                        />
                    </dl>
                )}
            </section>

            <section className="flex flex-1 flex-col">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-light">Upcoming</h2>
                </div>

                {isLoading ? (
                    <ul className="mb-6 flex flex-col gap-4">
                        {upcomingSkeletonRows.map((row) => (
                            <li
                                key={row.titleClassName}
                                className="flex items-center justify-between gap-3"
                            >
                                <SkeletonText className={row.titleClassName} />
                                <SkeletonText className={row.dateClassName} />
                            </li>
                        ))}
                    </ul>
                ) : upcoming.length === 0 ? (
                    <CustomEmptyState
                        title="Sin programadas"
                        description="No hay transacciones recurrentes próximas."
                        Icon={CalendarClock}
                        className="m-0! mb-6! p-4!"
                    />
                ) : (
                    <ul className="mb-6 flex flex-col">
                        {upcoming.map((item) => (
                            <UpcomingRow
                                key={`${item.title}-${item.nextExecutionDate}`}
                                item={item}
                                currency={currency}
                            />
                        ))}
                    </ul>
                )}

                {isLoading ? (
                    <SkeletonText className="mt-auto h-11 w-full" />
                ) : (
                    <button
                        type="button"
                        onClick={() => onSchedule?.()}
                        className="mt-auto h-11 w-full cursor-pointer rounded-lg border border-light-10 bg-transparent text-sm font-medium text-light transition-colors hover:bg-secondary"
                    >
                        Schedule a transaction
                    </button>
                )}
            </section>
        </aside>
    );
};

const UpcomingRow = ({
    item,
    currency,
}: {
    item: UpcomingTransaction;
    currency: string;
}) => {
    const isIncome = item.type === "INCOME";

    return (
        <li className="flex items-center gap-3 border-b border-light-10 py-3 last:border-b-0">
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isIncome ? "bg-info-25 text-info" : "bg-danger-sweet text-danger"
                }`}
            >
                {isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-light">{item.title}</p>
                <p className="mt-0.5 truncate text-xs text-helper">
                    {formatterDynamicDate(item.nextExecutionDate) || "—"}
                </p>
            </div>

            <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${
                    isIncome ? "text-info" : "text-danger"
                }`}
            >
                {isIncome ? "+" : "-"}
                {formatCurrency(Math.abs(item.amount), currency)}
            </p>
        </li>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-helper">{label}</dt>
        <dd className="text-right font-medium text-light">{value}</dd>
    </div>
);
