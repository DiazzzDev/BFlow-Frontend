import { Receipt } from "lucide-react";

import type { BudgetRecentActivityItem } from "../../budgets/interfaces/Budget";

import { BudgetCardEmpty } from "./BudgetCardEmpty";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface BudgetRecentActivityProps {
    title?: string;
    items?: BudgetRecentActivityItem[];
    currency?: string;
    isLoading?: boolean;
}

export const BudgetRecentActivity = ({
    title = "Recent Activity",
    items = [],
    currency = "USD",
    isLoading = false,
}: BudgetRecentActivityProps) => {
    return (
        <article className="flex min-h-64 flex-col rounded-2xl border border-light-10 bg-surface p-6 shadow-custom">
            <p className="mb-4 text-base font-semibold text-light">{title}</p>

            {isLoading ? (
                <ul className="flex flex-col">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between gap-4 border-b border-light-10 py-3 last:border-b-0"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="h-3.5 w-32 animate-pulse rounded-md bg-skeleton" />
                                <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-skeleton" />
                            </div>
                            <div className="h-3.5 w-16 shrink-0 animate-pulse rounded-md bg-skeleton" />
                        </li>
                    ))}
                </ul>
            ) : items.length === 0 ? (
                <BudgetCardEmpty
                    Icon={Receipt}
                    title="Sin historial"
                    description="Cuando registres gastos en este presupuesto, aparecerán aquí."
                />
            ) : (
                <ul className="flex flex-col">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 border-b border-light-10 py-3 last:border-b-0"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-light">
                                    {item.description}
                                </p>
                                <p className="mt-1 text-xs text-helper">
                                    {formatterDynamicDate(item.date) || "—"}
                                </p>
                            </div>
                            <p className="shrink-0 text-sm font-medium tabular-nums text-light">
                                {formatCurrency(item.amount, currency)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
};
