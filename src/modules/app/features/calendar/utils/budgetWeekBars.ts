import type { EnrichedBudget } from "../interfaces/Calendar";

import type { CalendarDayCellMeta } from "./calendarGrid";

export interface BudgetWeekBar {
    budget: EnrichedBudget;
    startColumn: number; // 1-7
    endColumn: number; // 1-7, inclusive
    isRangeStart: boolean; // the bar includes the budget's actual start date
    isRangeEnd: boolean; // the bar includes the budget's actual end date
}

const BUDGET_BAR_PALETTE = [
    "var(--color-primary)",
    "var(--color-info)",
    "var(--color-success)",
    "var(--color-warning)",
];

export const getBudgetBarColor = (index: number): string =>
    BUDGET_BAR_PALETTE[index % BUDGET_BAR_PALETTE.length];

/** For a single week (7 CalendarDayCellMeta), returns one bar per budget
 * whose [startDate, periodEndDate] range overlaps that week. */
export const getBudgetBarsForWeek = (
    week: CalendarDayCellMeta[],
    budgets: EnrichedBudget[],
): BudgetWeekBar[] => {
    if (week.length === 0) {return [];}

    const weekStartKey = week[0].dateKey;
    const weekEndKey = week[week.length - 1].dateKey;

    const bars: BudgetWeekBar[] = [];

    budgets.forEach((budget) => {
        const budgetStartKey = budget.startDate.slice(0, 10);
        const budgetEndKey = budget.periodEndDate;

        const overlaps = budgetStartKey <= weekEndKey && budgetEndKey >= weekStartKey;
        if (!overlaps) {return;}

        const startColumn = week.findIndex((day) => day.dateKey >= budgetStartKey) + 1;
        let endColumn = 0;
        for (let i = week.length - 1; i >= 0; i -= 1) {
            if (week[i].dateKey <= budgetEndKey) {
                endColumn = i + 1;
                break;
            }
        }

        if (startColumn === 0 || endColumn === 0 || startColumn > endColumn) {return;}

        bars.push({
            budget,
            startColumn,
            endColumn,
            isRangeStart: budgetStartKey >= weekStartKey,
            isRangeEnd: budgetEndKey <= weekEndKey,
        });
    });

    return bars;
};
