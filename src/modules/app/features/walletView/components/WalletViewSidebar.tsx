import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface WalletViewSidebarProps {
    lastActivity: string;
    highestExpense: string;
    transactionsCount: number;
    initialValue: number;
    currency: string;
    upcoming: Array<{ title: string; nextExecutionDate: string }>;
    onSchedule?: () => void;
    isLoading?: boolean;
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
}: WalletViewSidebarProps) => {
    return (
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-light-10 flex flex-col px-6 py-5 gap-8">
            <section>
                <h2 className="text-xl font-semibold text-light mb-5">Information</h2>
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

            <section className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-light">Upcoming</h2>
                    {isLoading ? (
                        <SkeletonText className="h-3.5 w-16" />
                    ) : (
                        <button
                            type="button"
                            className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
                        >
                            See all →
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <ul className="flex flex-col gap-4 mb-6">
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
                ) : (
                    <ul className="flex flex-col gap-4 mb-6">
                        {upcoming.map((item) => (
                            <li
                                key={`${item.title}-${item.nextExecutionDate}`}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <span className="text-light truncate">{item.title}</span>
                                <span className="text-helper shrink-0">
                                    {formatterDynamicDate(item.nextExecutionDate) || "—"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {isLoading ? (
                    <SkeletonText className="mt-auto h-11 w-full" />
                ) : (
                    <button
                        type="button"
                        onClick={() => onSchedule?.()}
                        className="w-full mt-auto h-11 rounded-lg border border-light-10 bg-transparent text-light text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
                    >
                        Schedule a transaction
                    </button>
                )}
            </section>
        </aside>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-helper">{label}</dt>
        <dd className="text-light font-medium text-right">{value}</dd>
    </div>
);
