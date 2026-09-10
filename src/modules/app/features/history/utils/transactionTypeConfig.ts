import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
} from "lucide-react";

import type { Transaction } from "@/modules/app/interfaces/Transaction";

export const HISTORY_TRANSACTION_TYPE_CONFIG: Record<
    Transaction["type"],
    { label: string; icon: typeof ArrowUpRight; className: string }
> = {
    INCOME: {
        label: "Ingreso",
        icon: ArrowDownLeft,
        className: "text-info bg-info/10 border-info/20",
    },
    EXPENSE: {
        label: "Gasto",
        icon: ArrowUpRight,
        className: "text-danger bg-danger/10 border-danger/20",
    },
    TRANSFER: {
        label: "Transferencia",
        icon: ArrowLeftRight,
        className: "text-primary bg-primary/10 border-primary/20",
    },
};
