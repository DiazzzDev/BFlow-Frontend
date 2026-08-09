import { useEffect, useState } from "react";

import type { Transaction, TransactionType } from "../interfaces/Transaction";
import { ExpenseForm } from "../../expenses/components/ExpenseForm";
import { IncomeForm } from "../../incomes/components/IncomeForm";
import { TransferForm } from "../../transfers/components/TransferForm";
import { toDateInputValue } from "../../wallets/utils/transactionActions";

import { CustomModal } from "@/components/custom/CustomModal";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";

type ModalMode = "create" | "view" | "edit";

interface NewTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId?: string;
    initialType?: TransactionType | null;
    mode?: ModalMode;
    transaction?: Transaction | null;
}

const transactionTabs: Array<{ id: TransactionType; label: string }> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
    { id: "TRANSFER", label: "Transferencia" },
];

const modalTitles: Record<ModalMode, Record<TransactionType, string>> = {
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

const resolveInitialType = (
    mode: ModalMode,
    transaction?: Transaction | null,
    initialType?: TransactionType | null,
): TransactionType => {
    if ((mode === "view" || mode === "edit") && transaction) {
        return transaction.type;
    }
    return initialType ?? "INCOME";
};

export const NewTransactionModal = ({
    isModalOpen,
    setIsModalOpen,
    walletId = "",
    initialType = null,
    mode = "create",
    transaction = null,
}: NewTransactionModalProps) => {
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const lockType = isViewMode || isEditMode;
    const resolvedWalletId =
        lockType && transaction ? transaction.walletId : walletId;

    const [activeType, setActiveType] = useState<TransactionType>(
        resolveInitialType(mode, transaction, initialType),
    );

    useEffect(() => {
        if (isModalOpen) {
            setActiveType(resolveInitialType(mode, transaction, initialType));
        }
    }, [isModalOpen, initialType, mode, transaction]);

    const handleClose = (open: boolean) => {
        if (!open) {
            setActiveType(resolveInitialType(mode, transaction, initialType));
        }
        setIsModalOpen(open);
    };

    const amountValue = transaction ? String(Math.abs(transaction.amount)) : "";
    const dateValue = transaction ? toDateInputValue(transaction.date) : "";
    const sharedInitialValues =
        lockType && transaction
            ? {
                  title: transaction.title,
                  description: transaction.description,
                  amount: amountValue,
                  date: dateValue,
                  categoryId: transaction.categoryId,
                  categoryName: transaction.categoryName,
              }
            : undefined;

    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={handleClose}
            title={mode === "create" ? "Nueva transacción" : modalTitles[mode][activeType]}
            maxWidth={activeType === "TRANSFER" ? "max-w-3xl" : "max-w-lg"}
        >
            <div className="flex flex-col gap-6">
                {!lockType && (
                    <SegmentedTabs
                        tabs={transactionTabs}
                        selected={activeType}
                        onChange={setActiveType}
                        ariaLabel="Tipo de transacción"
                    />
                )}

                {activeType === "INCOME" && (
                    <IncomeForm
                        key={
                            lockType
                                ? `${mode}-income-${transaction?.id}`
                                : "income-form"
                        }
                        walletId={resolvedWalletId}
                        readOnly={isViewMode}
                        transactionId={isEditMode ? transaction?.id : undefined}
                        source={transaction?.source || "manual"}
                        initialValues={sharedInitialValues}
                        onSuccess={() => handleClose(false)}
                    />
                )}

                {activeType === "EXPENSE" && (
                    <ExpenseForm
                        key={
                            lockType
                                ? `${mode}-expense-${transaction?.id}`
                                : "expense-form"
                        }
                        walletId={resolvedWalletId}
                        readOnly={isViewMode}
                        transactionId={isEditMode ? transaction?.id : undefined}
                        source={transaction?.source || "manual"}
                        initialValues={sharedInitialValues}
                        onSuccess={() => handleClose(false)}
                    />
                )}

                {activeType === "TRANSFER" && (
                    <TransferForm
                        key={
                            isViewMode
                                ? `view-transfer-${transaction?.id}`
                                : "transfer-form"
                        }
                        walletId={resolvedWalletId}
                        readOnly={isViewMode}
                        initialValues={
                            isViewMode && transaction
                                ? {
                                      counterpartWalletId:
                                          transaction.counterpartWalletId ?? "",
                                      counterpartWalletName:
                                          transaction.counterpartWalletName ??
                                          undefined,
                                      amount: amountValue,
                                      description: transaction.description,
                                      direction:
                                          transaction.amount < 0
                                              ? "outgoing"
                                              : "incoming",
                                  }
                                : undefined
                        }
                        onSuccess={() => handleClose(false)}
                    />
                )}
            </div>
        </CustomModal>
    );
};
