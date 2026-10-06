import { useTranslation } from "react-i18next";

export type ActivityFilter = "ALL" | "INCOME" | "EXPENSE";

interface ActivityFiltersProps {
    selected: ActivityFilter;
    onChange: (filter: ActivityFilter) => void;
}

export const ActivityFilters = ({ selected, onChange }: ActivityFiltersProps) => {
    const { t } = useTranslation();
    const filters: Array<{ value: ActivityFilter; label: string }> = [
        { value: "ALL", label: t("dashboard.activityAll") },
        { value: "INCOME", label: t("dashboard.income") },
        { value: "EXPENSE", label: t("dashboard.expenses") },
    ];

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            {filters.map((filter) => {
                const isSelected = selected === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onChange(filter.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            isSelected
                                ? "border-light bg-light text-surface-hard"
                                : "border-light-10 text-helper hover:border-light-25 hover:text-light"
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
};
