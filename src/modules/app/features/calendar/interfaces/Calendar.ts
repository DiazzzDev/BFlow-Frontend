import type { Transaction } from "@/modules/app/interfaces/Transaction";
import type { Budget } from "@/modules/app/interfaces/Budget";

/**
 * Raw shape returned by GET /api/v1/recurring (RecurringResponse).
 * Intentionally separate from the `Recurring` interface used by the
 * "create recurring" form (`walletView/interfaces/Recurring.ts`), which
 * models a different payload (CreateRecurringData).
 */
export interface RecurringOccurrenceSource {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    frequency: "DAILY" | "WEEKLY" | "MONTHLY";
    intervalValue: number;
    nextExecutionDate: string;
    categoryId: string;
    walletId: string;
    active: boolean;
}

/** A recurring definition enriched with names/colors resolved client-side
 * from the categories and wallets already loaded for the calendar. */
export interface EnrichedRecurring extends RecurringOccurrenceSource {
    categoryName: string | null;
    categoryIcon: string | null;
    categoryColor: string | null;
    walletName: string | null;
}

/** One projected occurrence of a recurring definition landing on a given day. */
export interface RecurringOccurrence {
    recurring: EnrichedRecurring;
    date: string; // yyyy-MM-dd
}

/** A budget enriched with a computed end date for the current period, since
 * the list endpoint (GET /api/v1/budgets) does not return `endDate` — only
 * `/budgets/{id}/detail` does. The range is derived from `startDate` + `period`. */
export interface EnrichedBudget extends Budget {
    periodEndDate: string; // yyyy-MM-dd, inclusive
}

export interface CalendarDaySummary {
    date: string; // yyyy-MM-dd
    income: number;
    expense: number;
    net: number;
    movementsCount: number;
    hasPending: boolean;
    transactions: Transaction[];
    recurringOccurrences: RecurringOccurrence[];
    budgets: EnrichedBudget[];
}

export type CalendarViewFilter = "ALL" | "EXPENSE" | "INCOME" | "RECURRING" | "BUDGETS";

export type CalendarLayout = "month" | "list";
