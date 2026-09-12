export type WalletTypeFilter = "MINE" | "SHARED";

export const WALLETS_TYPE_TABS: Array<{ label: string; value: WalletTypeFilter }> = [
    { label: "Mis billeteras", value: "MINE" },
    { label: "Compartidas", value: "SHARED" },
];

export const isWalletTypeFilter = (
    value: string | null,
): value is WalletTypeFilter => value === "MINE" || value === "SHARED";
