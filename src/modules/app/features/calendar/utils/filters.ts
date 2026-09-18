import type { CalendarViewFilter } from "../interfaces/Calendar";

export const CALENDAR_VIEW_FILTER_TABS: Array<{ label: string; value: CalendarViewFilter }> = [
    { label: "Todos", value: "ALL" },
    { label: "Gastos", value: "EXPENSE" },
    { label: "Ingresos", value: "INCOME" },
    { label: "Recurrencias", value: "RECURRING" },
    { label: "Budgets", value: "BUDGETS" },
];

export const CALENDAR_LAYOUT_TABS = [
    { id: "month" as const, label: "Mes" },
    { id: "list" as const, label: "Lista" },
];

export interface CalendarFilterState {
    view: CalendarViewFilter;
    walletId: string | null;
    categoryId: string | null;
    status: string | null;
}
