import { ChevronRight } from "lucide-react";

export type BudgetStatus = "exceeded" | "healthy" | "critical" | "warning";

export interface BudgetItemData {
    id: string;
    name: string;
    amountLabel: string;
    updatedLabel: string;
    tags: string[];
    status: BudgetStatus;
}

const statusStyles: Record<
    BudgetStatus,
    { label: string; className: string }
> = {
    exceeded: {
        label: "Exceeded",
        className: "bg-danger-sweet text-danger",
    },
    healthy: {
        label: "Healthy",
        className: "bg-info/15 text-info",
    },
    critical: {
        label: "Critical",
        className: "bg-primary-15 text-primary",
    },
    warning: {
        label: "Warning",
        className: "bg-warning-sweet text-warning",
    },
};

interface BudgetItemProps {
    budget: BudgetItemData;
    onClick?: () => void;
}

export const BudgetItem = ({ budget, onClick }: BudgetItemProps) => {
    const status = statusStyles[budget.status];

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-between gap-4 py-5 border-b border-light-10 last:border-b-0 text-left hover:bg-secondary/40 transition-colors cursor-pointer px-1"
        >
            <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-light truncate">
                    {budget.name}
                </p>
                <p className="text-sm text-helper mt-1 truncate">
                    {budget.amountLabel}
                    {" - "}
                    {budget.updatedLabel}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    {budget.tags.map((tag) => (
                        <span
                            key={`${budget.id}-${tag}`}
                            className="inline-flex items-center rounded-full border border-light-10 bg-surface-hard px-2.5 py-0.5 text-xs text-helper"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                >
                    {status.label}
                </span>
                <ChevronRight className="h-5 w-5 text-helper" />
            </div>
        </button>
    );
};
