import type { TransactionType } from "@/modules/app/interfaces/Transaction";
import { TRANSACTION_TYPE_VALUES } from "@/modules/app/interfaces/Transaction";

export const TRANSACTION_TYPE_TABS: Array<{
    id: TransactionType;
    label: string;
}> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
    { id: "TRANSFER", label: "Transferencia" },
];

export const getVisibleTransactionTypeTabs = (
    allowedTypes: readonly TransactionType[] = TRANSACTION_TYPE_VALUES,
) => TRANSACTION_TYPE_TABS.filter((tab) => allowedTypes.includes(tab.id));
