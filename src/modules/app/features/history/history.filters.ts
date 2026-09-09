import type { TransactionType } from "../walletView/interfaces/Transaction";

export const HISTORY_TYPE_TABS: Array<{
    label: string;
    value: TransactionType | "ALL";
}> = [
    { label: "Todas", value: "ALL" },
    { label: "Ingresos", value: "INCOME" },
    { label: "Gastos", value: "EXPENSE" },
    { label: "Transferencias", value: "TRANSFER" },
];
