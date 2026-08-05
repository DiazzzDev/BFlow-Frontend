import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface ActivityItem {
    id: string;
    title: string;
    dateLabel: string;
    amount: number;
}

interface BudgetRecentActivityProps {
    title?: string;
    items?: ActivityItem[];
    currency?: string;
    empty?: boolean;
}

export const BudgetRecentActivity = ({
    title = "Recent Activity",
    items = [],
    currency = "USD",
    empty = false,
}: BudgetRecentActivityProps) => {
    return (
        <article className="rounded-2xl border border-light-10 bg-surface px-5 py-4 min-h-56 flex flex-col">
            <p className="text-sm font-medium text-light mb-4">{title}</p>

            {empty || items.length === 0 ? (
                <div className="flex-1" />
            ) : (
                <ul className="flex flex-col">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 py-3 border-b border-light-10 last:border-b-0"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-light truncate">
                                    {item.title}
                                </p>
                                <p className="text-xs text-helper mt-1">{item.dateLabel}</p>
                            </div>
                            <p className="text-sm font-medium text-light tabular-nums shrink-0">
                                {formatCurrency(item.amount, currency)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
};
