import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CircleDot } from "lucide-react";

import { parseDateKey } from "../utils/calendarGrid";
import type { CalendarDayCellMeta } from "../utils/calendarGrid";
import type { CalendarDaySummary } from "../interfaces/Calendar";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface CalendarListViewProps {
    weeks: CalendarDayCellMeta[][];
    daySummaries: Map<string, CalendarDaySummary>;
    onSelectDay: (dateKey: string) => void;
    currency?: string;
}

export const CalendarListView = ({
    weeks,
    daySummaries,
    onSelectDay,
    currency = "USD",
}: CalendarListViewProps) => {
    const days = weeks
        .flat()
        .filter((day) => day.isCurrentMonth)
        .map((day) => ({ day, summary: daySummaries.get(day.dateKey) }))
        .filter(
            ({ summary }) =>
                (summary?.movementsCount ?? 0) > 0 ||
                (summary?.recurringOccurrences.length ?? 0) > 0 ||
                (summary?.budgets.length ?? 0) > 0,
        );

    if (days.length === 0) {
        return (
            <CustomEmptyState
                title="Sin actividad este período"
                description="No hay movimientos, recurrencias ni presupuestos que mostrar con los filtros actuales."
            />
        );
    }

    return (
        <div className="flex flex-col divide-y divide-light-10 overflow-hidden rounded-2xl border border-light-10 bg-surface shadow-custom">
            {days.map(({ day, summary }) => (
                <button
                    key={day.dateKey}
                    type="button"
                    onClick={() => onSelectDay(day.dateKey)}
                    className="flex cursor-pointer items-center justify-between gap-4 bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-hard/60"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-light-5 text-light">
                            <span className="text-[10px] uppercase leading-none text-helper">
                                {format(parseDateKey(day.dateKey), "MMM", { locale: es })}
                            </span>
                            <span className="text-sm font-semibold leading-none">
                                {day.date.getDate()}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium capitalize text-light">
                                {format(parseDateKey(day.dateKey), "EEEE d 'de' MMMM", { locale: es })}
                            </span>
                            <span className="text-xs text-helper">
                                {summary?.movementsCount ?? 0} movimientos
                                {summary?.recurringOccurrences.length
                                    ? ` · ${summary.recurringOccurrences.length} recurrencia(s)`
                                    : ""}
                                {summary?.budgets.length ? ` · ${summary.budgets.length} budget(s)` : ""}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {summary?.hasPending && <CircleDot className="h-3.5 w-3.5 text-warning" />}
                        <div className="flex flex-col items-end text-xs">
                            {(summary?.income ?? 0) > 0 && (
                                <span className="font-medium text-info">
                                    +{formatCurrency(summary!.income, currency)}
                                </span>
                            )}
                            {(summary?.expense ?? 0) > 0 && (
                                <span className="font-medium text-danger">
                                    -{formatCurrency(summary!.expense, currency)}
                                </span>
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};
