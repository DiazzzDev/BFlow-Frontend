import type {
    CalendarDaySummary,
    EnrichedBudget,
    RecurringOccurrence,
} from "../interfaces/Calendar";

import { doesBudgetCoverDate } from "./budgetRange";

import type { Transaction } from "@/modules/app/interfaces/Transaction";

const isPendingStatus = (status: string | null): boolean =>
    (status ?? "").trim().toUpperCase() === "PENDING";

export const buildEmptyDaySummary = (dateKey: string): CalendarDaySummary => ({
    date: dateKey,
    income: 0,
    expense: 0,
    net: 0,
    movementsCount: 0,
    hasPending: false,
    transactions: [],
    recurringOccurrences: [],
    budgets: [],
});

export interface BuildDaySummariesInput {
    dateKeys: string[];
    transactions: Transaction[];
    recurringOccurrences: RecurringOccurrence[];
    budgets: EnrichedBudget[];
}

/** Groups already-fetched data into one summary per requested day. Pure
 * client-side aggregation — no additional API calls. */
export const buildDaySummaries = ({
    dateKeys,
    transactions,
    recurringOccurrences,
    budgets,
}: BuildDaySummariesInput): Map<string, CalendarDaySummary> => {
    const summaries = new Map<string, CalendarDaySummary>();

    for (const dateKey of dateKeys) {
        summaries.set(dateKey, buildEmptyDaySummary(dateKey));
    }

    for (const transaction of transactions) {
        const dateKey = transaction.date.slice(0, 10);
        const summary = summaries.get(dateKey);
        if (!summary) {continue;}

        if (transaction.type === "INCOME") {
            summary.income += transaction.amount;
        } else if (transaction.type === "EXPENSE") {
            summary.expense += Math.abs(transaction.amount);
        }

        summary.net = summary.income - summary.expense;
        summary.movementsCount += 1;
        summary.hasPending = summary.hasPending || isPendingStatus(transaction.status);
        summary.transactions.push(transaction);
    }

    for (const occurrence of recurringOccurrences) {
        const summary = summaries.get(occurrence.date);
        if (!summary) {continue;}
        summary.recurringOccurrences.push(occurrence);
    }

    for (const dateKey of dateKeys) {
        const summary = summaries.get(dateKey);
        if (!summary) {continue;}
        summary.budgets = budgets.filter((budget) => doesBudgetCoverDate(budget, dateKey));
    }

    return summaries;
};
