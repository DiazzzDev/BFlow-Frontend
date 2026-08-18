export type BudgetViewTab = "overview" | "settings";

export const BUDGET_VIEW_TABS: Array<{ id: BudgetViewTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "settings", label: "Settings" },
];

export const isBudgetViewTab = (value: string | null): value is BudgetViewTab =>
    !!value && BUDGET_VIEW_TABS.some((tab) => tab.id === value);
