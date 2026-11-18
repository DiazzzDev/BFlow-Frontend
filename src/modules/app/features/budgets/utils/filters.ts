import type { BudgetScope } from "@/modules/app/interfaces/Budget";

export const BUDGET_PERIOD_TABS: Array<{ label: string; value: string }> = [
    { label: "Todos", value: "ALL" },
    { label: "Mensual", value: "MONTHLY" },
    { label: "Semanal", value: "WEEKLY" },
    { label: "Anual", value: "YEARLY" },
];

export const BUDGET_SCOPE_TABS: Array<{ id: BudgetScope; labelKey: string }> = [
    { id: "WALLET", labelKey: "budgets.scopes.wallet" },
    { id: "CATEGORY_GLOBAL", labelKey: "budgets.scopes.category" },
    { id: "WALLET_CATEGORY", labelKey: "budgets.scopes.walletCategory" },
];

export const BUDGET_SORT_OPTIONS: Array<{ label: string; value: string }> = [
    { value: "amount,desc", label: "Mayor monto" },
    { value: "amount,asc", label: "Menor monto" },
    { value: "updatedAt,desc", label: "Más recientes" },
    { value: "startDate,desc", label: "Inicio reciente" },
];
