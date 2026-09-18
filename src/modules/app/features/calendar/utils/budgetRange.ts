import { addDays, addMonths, addWeeks, addYears, parseISO, subDays } from "date-fns";

import type { EnrichedBudget } from "../interfaces/Calendar";

import { toDateKey } from "./calendarGrid";

import type { Budget, BudgetPeriod } from "@/modules/app/interfaces/Budget";

/**
 * The budgets list endpoint (GET /api/v1/budgets) does not return `endDate`
 * — only `/budgets/{id}/detail` does, and fetching the detail for every
 * budget just to draw the calendar would mean N extra requests per month
 * view. Instead we derive the period's end date client-side from
 * `startDate` + `period`, mirroring how a single billing period is expected
 * to span (start date up to, but not including, the next period's start).
 */
export const getBudgetPeriodEnd = (startDate: string, period: BudgetPeriod): Date => {
    const start = parseISO(startDate);

    switch (period) {
        case "DAILY":
            return start;
        case "WEEKLY":
            return subDays(addWeeks(start, 1), 1);
        case "MONTHLY":
            return subDays(addMonths(start, 1), 1);
        case "YEARLY":
            return subDays(addYears(start, 1), 1);
        default:
            return start;
    }
};

export const enrichBudgetWithRange = (budget: Budget): EnrichedBudget => ({
    ...budget,
    periodEndDate: toDateKey(getBudgetPeriodEnd(budget.startDate, budget.period)),
});

export const doesBudgetCoverDate = (budget: EnrichedBudget, dateKey: string): boolean => {
    const start = budget.startDate.slice(0, 10);
    const end = budget.periodEndDate;

    return dateKey >= start && dateKey <= end;
};

/** Inclusive day count between two yyyy-MM-dd keys, clamped to >= 1. */
export const daySpan = (startKey: string, endKey: string): number => {
    const diff = (parseISO(endKey).getTime() - parseISO(startKey).getTime()) / 86_400_000;
    return Math.max(1, Math.round(diff) + 1);
};

export const clampDateKey = (dateKey: string, minKey: string, maxKey: string): string => {
    if (dateKey < minKey) {return minKey;}
    if (dateKey > maxKey) {return maxKey;}
    return dateKey;
};

export const addDaysToKey = (dateKey: string, amount: number): string =>
    toDateKey(addDays(parseISO(dateKey), amount));
