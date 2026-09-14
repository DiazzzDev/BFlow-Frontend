import type { TransactionType } from "@/modules/app/interfaces/Transaction";

export type TransactionModalMode = "create" | "view" | "edit";

export const TRANSACTION_MODAL_TITLES: Record<
    TransactionModalMode,
    Record<TransactionType, string>
> = {
    create: {
        INCOME: "Nueva transacción",
        EXPENSE: "Nueva transacción",
        TRANSFER: "Nueva transacción",
    },
    view: {
        INCOME: "Detalle de ingreso",
        EXPENSE: "Detalle de gasto",
        TRANSFER: "Detalle de transferencia",
    },
    edit: {
        INCOME: "Editar ingreso",
        EXPENSE: "Editar gasto",
        TRANSFER: "Editar transferencia",
    },
};

export const getTransactionModalTitle = (
    mode: TransactionModalMode,
    type: TransactionType,
) =>
    mode === "create"
        ? "Nueva transacción"
        : TRANSACTION_MODAL_TITLES[mode][type];
