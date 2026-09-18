import { CircleDot } from "lucide-react";

import type { CalendarDayCellMeta } from "../utils/calendarGrid";
import type { CalendarDaySummary } from "../interfaces/Calendar";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface CalendarDayCellProps {
    day: CalendarDayCellMeta;
    summary: CalendarDaySummary | undefined;
    currency?: string;
    onSelect: (dateKey: string) => void;
}

const MAX_RECURRING_CHIPS = 2;

export const CalendarDayCell = ({
    day,
    summary,
    currency = "USD",
    onSelect,
}: CalendarDayCellProps) => {
    const hasMovements = (summary?.movementsCount ?? 0) > 0;
    const hasRecurring = (summary?.recurringOccurrences.length ?? 0) > 0;
    const visibleRecurring = summary?.recurringOccurrences.slice(0, MAX_RECURRING_CHIPS) ?? [];
    const extraRecurringCount = Math.max(
        0,
        (summary?.recurringOccurrences.length ?? 0) - visibleRecurring.length,
    );

    return (
        <button
            type="button"
            onClick={() => onSelect(day.dateKey)}
            className={`flex min-h-24 flex-col items-stretch gap-1 rounded-xl border px-2 py-1.5 text-left transition-all sm:min-h-28 ${
                day.isCurrentMonth
                    ? "border-light-10 bg-surface hover:border-light-25 hover:shadow-custom"
                    : "border-transparent bg-transparent opacity-40 hover:opacity-70"
            } ${day.isToday ? "ring-1 ring-primary/70" : ""}`}
        >
            <div className="flex items-center justify-between">
                <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        day.isToday ? "bg-primary text-light" : "text-light"
                    }`}
                >
                    {day.date.getDate()}
                </span>

                {summary?.hasPending ? (
                    <CircleDot className="h-3 w-3 text-warning" aria-label="Movimientos pendientes" />
                ) : null}
            </div>

            {/* Empty days stay empty — no filler text, no repeated noise. */}
            {hasMovements && (
                <div className="flex flex-col gap-0.5 text-[11px] leading-tight">
                    {summary!.income > 0 && (
                        <span className="truncate font-medium text-info">
                            +{formatCurrency(summary!.income, currency)}
                        </span>
                    )}
                    {summary!.expense > 0 && (
                        <span className="truncate font-medium text-danger">
                            -{formatCurrency(summary!.expense, currency)}
                        </span>
                    )}
                </div>
            )}

            {hasRecurring && (
                <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {visibleRecurring.map((occurrence) => (
                        <span
                            key={`${occurrence.recurring.id}-${occurrence.date}`}
                            title={`${occurrence.recurring.title} · ${formatCurrency(Math.abs(occurrence.recurring.amount), currency)}`}
                            className="max-w-full truncate rounded-full border border-primary/30 bg-primary-15 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                        >
                            {occurrence.recurring.title}
                        </span>
                    ))}
                    {extraRecurringCount > 0 && (
                        <span className="rounded-full border border-light-10 bg-light-5 px-1.5 py-0.5 text-[10px] text-helper">
                            +{extraRecurringCount}
                        </span>
                    )}
                </div>
            )}

            {hasMovements && summary!.movementsCount > 1 && (
                <span className="mt-auto self-end text-[10px] text-helper">
                    {summary!.movementsCount} movs.
                </span>
            )}
        </button>
    );
};
