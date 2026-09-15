import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export type DetailTab =
    | "overview"
    | "incomes"
    | "expenses"
    | "transfers"
    | "members"
    | "settings";

export const WALLET_VIEW_TABS: Array<{ id: DetailTab; label: string }> = [
    { id: "overview", label: "Todas las transacciones" },
    { id: "incomes", label: "Ingresos" },
    { id: "expenses", label: "Gastos" },
    { id: "transfers", label: "Transferencias" },
    { id: "members", label: "Miembros" },
    { id: "settings", label: "Ajustes" },
];

export const TAB_TO_TYPE: Record<
    Exclude<DetailTab, "overview" | "members" | "settings">,
    TransactionType
> = {
    incomes: "INCOME",
    expenses: "EXPENSE",
    transfers: "TRANSFER",
};

// Shared wallets cannot create or list transfers between wallets
export const walletAllowsTransfers = (memberCount: number) => memberCount <= 1;

export const getWalletAllowedTransactionTypes = (memberCount: number) =>
    walletAllowsTransfers(memberCount)
        ? (["INCOME", "EXPENSE", "TRANSFER"] as const)
        : (["INCOME", "EXPENSE"] as const);

export const getVisibleWalletViewTabs = (
    memberCount: number,
    options?: { forceHideTransfers?: boolean },
) =>
    WALLET_VIEW_TABS.filter(
        (tab) =>
            tab.id !== "transfers" ||
            (!options?.forceHideTransfers &&
                walletAllowsTransfers(memberCount)),
    );

export const resolveWalletViewTab = (
    tab: DetailTab,
    memberCount: number,
): DetailTab =>
    tab === "transfers" && !walletAllowsTransfers(memberCount)
        ? "overview"
        : tab;

export const isManagementTab = (tab: DetailTab) =>
    tab === "members" || tab === "settings";

export const isDetailTab = (value: string | null): value is DetailTab =>
    !!value && WALLET_VIEW_TABS.some((tab) => tab.id === value);
