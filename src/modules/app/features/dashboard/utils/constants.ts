import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export const DASHBOARD_DEFAULT_CURRENCY = "USD";

// Dashboard quick-create excludes transfers
export const DASHBOARD_TRANSACTION_TYPES = [
    "INCOME",
    "EXPENSE",
] as const satisfies readonly TransactionType[];
