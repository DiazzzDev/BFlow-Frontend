import type { TransactionType } from "./interfaces/Transaction";

export type DetailTab = "overview" | "incomes" | "expenses" | "transfers" | "settings";

export const WALLET_VIEW_TABS: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "Todas las transacciones" },
    { id: "incomes", label: "Ingresos" },
    { id: "expenses", label: "Gastos" },
    { id: "transfers", label: "Transferencias" },
    { id: "settings", label: "Ajustes" },
];

export const TAB_TO_TYPE: Record<Exclude<DetailTab, "overview" | "settings">, TransactionType> = {
    incomes: "INCOME",
    expenses: "EXPENSE",
    transfers: "TRANSFER",
};

export const isDetailTab = (value: string | null): value is DetailTab =>
    !!value && WALLET_VIEW_TABS.some((tab) => tab.id === value);
