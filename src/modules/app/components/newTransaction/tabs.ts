import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export const TRANSACTION_TYPE_TABS: Array<{
    id: TransactionType;
    label: string;
}> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
    { id: "TRANSFER", label: "Transferencia" },
];
