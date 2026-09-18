import { WEEKDAY_LABELS, type CalendarDayCellMeta } from "../utils/calendarGrid";
import { getBudgetBarColor, getBudgetBarsForWeek } from "../utils/budgetWeekBars";
import type { CalendarDaySummary, EnrichedBudget } from "../interfaces/Calendar";

import { CalendarDayCell } from "./CalendarDayCell";

import { getBudgetDisplayName } from "@/modules/app/features/budgets/utils/budgetStatus";

interface CalendarMonthGridProps {
    weeks: CalendarDayCellMeta[][];
    daySummaries: Map<string, CalendarDaySummary>;
    budgets: EnrichedBudget[];
    onSelectDay: (dateKey: string) => void;
    onSelectBudget: (budgetId: string) => void;
    currency?: string;
}

const MAX_BARS_PER_WEEK = 2;

export const CalendarMonthGrid = ({
    weeks,
    daySummaries,
    budgets,
    onSelectDay,
    onSelectBudget,
    currency,
}: CalendarMonthGridProps) => {
    const showBudgetBars = budgets.length > 0;
    const budgetColorIndex = new Map(budgets.map((budget, index) => [budget.id, index]));

    return (
        <div className="rounded-2xl border border-light-10 bg-surface p-4 shadow-custom sm:p-5">
            <div className="grid grid-cols-7 gap-2 px-1 pb-2 text-center text-[11px] font-medium uppercase tracking-wide text-helper">
                {WEEKDAY_LABELS.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>

            <div className="flex flex-col gap-2.5">
                {weeks.map((week) => {
                    const weekKey = week[0]?.dateKey ?? "week";
                    const bars = showBudgetBars
                        ? getBudgetBarsForWeek(week, budgets).slice(0, MAX_BARS_PER_WEEK)
                        : [];

                    return (
                        <div key={weekKey} className="flex flex-col gap-1.5">
                            <div className="grid grid-cols-7 gap-2">
                                {week.map((day) => (
                                    <CalendarDayCell
                                        key={day.dateKey}
                                        day={day}
                                        summary={daySummaries.get(day.dateKey)}
                                        currency={currency}
                                        onSelect={onSelectDay}
                                    />
                                ))}
                            </div>

                            {/* Budget duration bars: a rounded, labeled pill per
                                week-segment — a real interval indicator rather
                                than a plain divider line. The label only shows
                                on the segment where the period actually starts,
                                so it isn't repeated on every row it crosses. */}
                            {bars.length > 0 && (
                                <div className="grid grid-cols-7 gap-2 px-0.5">
                                    {bars.map((bar) => {
                                        const color = getBudgetBarColor(
                                            budgetColorIndex.get(bar.budget.id) ?? 0,
                                        );

                                        return (
                                            <button
                                                key={bar.budget.id}
                                                type="button"
                                                onClick={() => onSelectBudget(bar.budget.id)}
                                                title={`${getBudgetDisplayName(bar.budget)}: ${bar.budget.startDate.slice(0, 10)} → ${bar.budget.periodEndDate}`}
                                                style={{
                                                    gridColumn: `${bar.startColumn} / ${bar.endColumn + 1}`,
                                                    backgroundColor: `${color}26`,
                                                    borderColor: `${color}80`,
                                                    color,
                                                }}
                                                className="flex h-6 cursor-pointer items-center justify-start overflow-hidden rounded-full border px-2.5 text-left text-[10px] font-medium transition-opacity hover:opacity-80"
                                            >
                                                {bar.isRangeStart && (
                                                    <span className="truncate">
                                                        {getBudgetDisplayName(bar.budget)}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
