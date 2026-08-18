import type { TransactionType } from "./interfaces/Transaction";

export type DetailTab = "overview" | "incomes" | "expenses" | "transfers" | "settings";

export const WALLET_VIEW_TABS: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "All transactions" },
    { id: "incomes", label: "Incomes" },
    { id: "expenses", label: "Expenses" },
    { id: "transfers", label: "Transfers" },
    { id: "settings", label: "Settings" },
];

export const TAB_TO_TYPE: Record<Exclude<DetailTab, "overview" | "settings">, TransactionType> = {
    incomes: "INCOME",
    expenses: "EXPENSE",
    transfers: "TRANSFER",
};

export const isDetailTab = (value: string | null): value is DetailTab =>
    !!value && WALLET_VIEW_TABS.some((tab) => tab.id === value);
