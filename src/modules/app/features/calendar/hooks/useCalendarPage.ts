import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";


import {
    buildMonthWeeks,
    goToNextMonth,
    goToPreviousMonth,
    toDateKey,
    type CalendarDayCellMeta,
} from "../utils/calendarGrid";
import { buildDaySummaries } from "../utils/buildDaySummaries";
import { enrichRecurring } from "../utils/enrichRecurring";
import { projectRecurringOccurrences } from "../utils/recurringOccurrences";
import type {
    CalendarDaySummary,
    CalendarLayout,
    CalendarViewFilter,
    EnrichedBudget,
    RecurringOccurrence,
} from "../interfaces/Calendar";

import { useGetCalendarTransactions } from "./useGetCalendarTransactions";
import { useGetCalendarRecurring } from "./useGetCalendarRecurring";
import { useGetCalendarBudgets } from "./useGetCalendarBudgets";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { useGetCategories } from "@/modules/app/features/settings/hooks/useGetCategories";
import { useGetWallets } from "@/modules/app/features/wallets/hooks/useGetWallets";

const isRecurringSource = (transaction: Transaction) =>
    (transaction.source ?? "").trim().toUpperCase() === "RECURRING";

const isValidLayout = (value: string | null): value is CalendarLayout =>
    value === "month" || value === "list";

const isValidView = (value: string | null): value is CalendarViewFilter =>
    value === "ALL" ||
    value === "EXPENSE" ||
    value === "INCOME" ||
    value === "RECURRING" ||
    value === "BUDGETS";

export const useCalendarPage = () => {
    const [params, setParams] = useSearchParams();

    const monthParam = params.get("month");
    const anchorDate = useMemo(
        () => (monthParam ? parseISO(`${monthParam}-01`) : new Date()),
        [monthParam],
    );

    const layoutParam = params.get("layout");
    const layout: CalendarLayout = isValidLayout(layoutParam) ? layoutParam : "month";

    const viewParam = params.get("view");
    const view: CalendarViewFilter = isValidView(viewParam) ? viewParam : "ALL";

    const walletId = params.get("walletId");
    const categoryId = params.get("categoryId");
    const status = params.get("status");

    const setMonth = (date: Date) => {
        const next = new URLSearchParams(params);
        next.set("month", format(date, "yyyy-MM"));
        setParams(next, { replace: true });
    };

    const setLayout = (nextLayout: CalendarLayout) => {
        const next = new URLSearchParams(params);
        if (nextLayout === "month") {
            next.delete("layout");
        } else {
            next.set("layout", nextLayout);
        }
        setParams(next, { replace: true });
    };

    const setView = (nextView: CalendarViewFilter) => {
        const next = new URLSearchParams(params);
        if (nextView === "ALL") {
            next.delete("view");
        } else {
            next.set("view", nextView);
        }
        setParams(next, { replace: true });
    };

    const setFilter = (key: "walletId" | "categoryId" | "status", value: string | null) => {
        const next = new URLSearchParams(params);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        setParams(next, { replace: true });
    };

    const goPrevious = () => setMonth(goToPreviousMonth(anchorDate));
    const goNext = () => setMonth(goToNextMonth(anchorDate));

    // --- Data ---
    const { transactions, isLoading: isLoadingTransactions } = useGetCalendarTransactions();
    const { recurring, isLoading: isLoadingRecurring } = useGetCalendarRecurring();
    const { budgets, isLoading: isLoadingBudgets } = useGetCalendarBudgets();
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategories();
    const { data: walletsResponse, isLoading: isLoadingWallets } = useGetWallets("MINE", "", 0, 50);

    const categories = useMemo(() => categoriesResponse?.data ?? [], [categoriesResponse]);
    const wallets = useMemo(() => walletsResponse?.data.content ?? [], [walletsResponse]);

    const isLoading =
        isLoadingTransactions ||
        isLoadingRecurring ||
        isLoadingBudgets ||
        isLoadingCategories ||
        isLoadingWallets;

    // --- Grid ---
    const weeks: CalendarDayCellMeta[][] = useMemo(() => buildMonthWeeks(anchorDate), [anchorDate]);
    const visibleDateKeys = useMemo(() => weeks.flat().map((day) => day.dateKey), [weeks]);
    const rangeStartKey = visibleDateKeys[0];
    const rangeEndKey = visibleDateKeys[visibleDateKeys.length - 1];

    // --- Filtering (applied before aggregation) ---
    const enrichedRecurring = useMemo(
        () => enrichRecurring(recurring, categories, wallets),
        [recurring, categories, wallets],
    );

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            if (view === "EXPENSE" && transaction.type !== "EXPENSE") {return false;}
            if (view === "INCOME" && transaction.type !== "INCOME") {return false;}
            if (view === "RECURRING" && !isRecurringSource(transaction)) {return false;}
            if (view === "BUDGETS") {return false;}
            if (walletId && transaction.walletId !== walletId) {return false;}
            if (categoryId && transaction.categoryId !== categoryId) {return false;}
            if (status && (transaction.status ?? "").toUpperCase() !== status.toUpperCase()) {return false;}
            return true;
        });
    }, [transactions, view, walletId, categoryId, status]);

    const filteredRecurring = useMemo(() => {
        return enrichedRecurring.filter((item) => {
            if (view === "EXPENSE" && item.type !== "EXPENSE") {return false;}
            if (view === "INCOME" && item.type !== "INCOME") {return false;}
            if (view === "BUDGETS") {return false;}
            if (walletId && item.walletId !== walletId) {return false;}
            if (categoryId && item.categoryId !== categoryId) {return false;}
            return true;
        });
    }, [enrichedRecurring, view, walletId, categoryId]);

    const filteredBudgets = useMemo(() => {
        if (view === "EXPENSE" || view === "INCOME" || view === "RECURRING") {return [] as EnrichedBudget[];}
        return budgets.filter((budget) => {
            if (walletId && budget.walletId && budget.walletId !== walletId) {return false;}
            if (categoryId && budget.categoryId && budget.categoryId !== categoryId) {return false;}
            return true;
        });
    }, [budgets, view, walletId, categoryId]);

    const visibleRecurringOccurrences: RecurringOccurrence[] = useMemo(
        () =>
            rangeStartKey && rangeEndKey
                ? projectRecurringOccurrences(filteredRecurring, rangeStartKey, rangeEndKey)
                : [],
        [filteredRecurring, rangeStartKey, rangeEndKey],
    );

    const daySummaries: Map<string, CalendarDaySummary> = useMemo(
        () =>
            buildDaySummaries({
                dateKeys: visibleDateKeys,
                transactions: filteredTransactions,
                recurringOccurrences: visibleRecurringOccurrences,
                budgets: filteredBudgets,
            }),
        [visibleDateKeys, filteredTransactions, visibleRecurringOccurrences, filteredBudgets],
    );

    // --- Top summary (current month only, regardless of extra grid days) ---
    const monthKeyPrefix = format(anchorDate, "yyyy-MM");
    const monthSummary = useMemo(() => {
        let income = 0;
        let expense = 0;
        let movements = 0;

        for (const summary of daySummaries.values()) {
            if (!summary.date.startsWith(monthKeyPrefix)) {continue;}
            income += summary.income;
            expense += summary.expense;
            movements += summary.movementsCount;
        }

        const currentMonthStartKey = toDateKey(startOfMonth(anchorDate));
        const currentMonthEndKey = toDateKey(endOfMonth(anchorDate));
        const activeBudgetsCount = filteredBudgets.filter((budget) => {
            const budgetStartKey = budget.startDate.slice(0, 10);
            return budgetStartKey <= currentMonthEndKey && budget.periodEndDate >= currentMonthStartKey;
        }).length;

        const todayKey = toDateKey(new Date());
        const upcomingRecurring = visibleRecurringOccurrences
            .filter((occurrence) => occurrence.date >= todayKey)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3);

        return {
            income,
            expense,
            net: income - expense,
            movements,
            activeBudgetsCount,
            upcomingRecurring,
        };
    }, [daySummaries, monthKeyPrefix, filteredBudgets, visibleRecurringOccurrences, anchorDate]);

    // --- Selection / panel state ---
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
    const [selectedRecurringId, setSelectedRecurringId] = useState<string | null>(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const selectedDaySummary = selectedDayKey ? daySummaries.get(selectedDayKey) ?? null : null;
    const selectedRecurring = selectedRecurringId
        ? enrichedRecurring.find((item) => item.id === selectedRecurringId) ?? null
        : null;

    return {
        // navigation
        anchorDate,
        layout,
        setLayout,
        goPrevious,
        goNext,
        monthLabel: format(anchorDate, "MMMM yyyy"),

        // filters
        view,
        setView,
        walletId,
        categoryId,
        status,
        setFilter,
        wallets,
        categories,

        // grid + data
        weeks,
        daySummaries,
        budgets: filteredBudgets,
        isLoading,
        monthSummary,

        // selection
        selectedDayKey,
        setSelectedDayKey,
        selectedDaySummary,
        selectedRecurringId,
        setSelectedRecurringId,
        selectedRecurring,
        selectedBudgetId,
        setSelectedBudgetId,
        isCreateModalOpen,
        setIsCreateModalOpen,
    };
};
