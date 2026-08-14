import { useEffect, useState } from "react";

import type { Transaction, TransactionType } from "../features/walletView/interfaces/Transaction";
import { ExpenseForm } from "../features/expenses/components/ExpenseForm";
import { IncomeForm } from "../features/incomes/components/IncomeForm";
import { TransferForm } from "../features/transfers/components/TransferForm";
import { useGetWallets } from "../features/wallets/hooks/useGetWallets";
import type { Wallet } from "../features/wallets/interfaces/Wallets";
import { toDateInputValue } from "../features/wallets/utils/transaction.service";

import { CustomModal } from "@/components/custom/CustomModal";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";

type ModalMode = "create" | "view" | "edit";

interface NewTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId?: string;
    /** When true (or when create mode has no walletId), show a wallet picker. */
    requireWalletSelect?: boolean;
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
    requireWalletSelect,
    initialType = null,
    mode = "create",
    transaction = null,
}: NewTransactionModalProps) => {
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const lockType = isViewMode || isEditMode;
    const needsWalletSelect =
        requireWalletSelect ?? (mode === "create" && !walletId);

    const [activeType, setActiveType] = useState<TransactionType>(
        resolveInitialType(mode, transaction, initialType),
    );
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [walletQuery, setWalletQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);

    const { data: walletsResponse, isLoading: isWalletsLoading } = useGetWallets(
        "MINE",
        debouncedWalletQuery,
        0,
        20,
    );

    const wallets = walletsResponse?.data.content ?? [];

    useEffect(() => {
        const f = () => {
            if (!isModalOpen) { return };
            setActiveType(resolveInitialType(mode, transaction, initialType));
            if (needsWalletSelect) {
                setSelectedWallet(null);
                setWalletQuery("");
            }
        }
        f();
    }, [isModalOpen, initialType, mode, transaction, needsWalletSelect]);

    const handleClose = (open: boolean) => {
        if (!open) {
            setActiveType(resolveInitialType(mode, transaction, initialType));
            setSelectedWallet(null);
            setWalletQuery("");
        }
        setIsModalOpen(open);
    };

    const resolvedWalletId =
        lockType && transaction
            ? transaction.walletId
            : needsWalletSelect
                ? (selectedWallet?.id ?? "")
                : walletId;

    const canShowForms = Boolean(resolvedWalletId);
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
                {needsWalletSelect && (
                    <SelectAutoComplete<Wallet>
                        idSelect="transactionWalletId"
                        label="Cartera"
                        placeholder={
                            isWalletsLoading
                                ? "Cargando carteras..."
                                : "Seleccionar cartera..."
                        }
                        selectedItem={selectedWallet}
                        setSelectedItem={setSelectedWallet}
                        query={walletQuery}
                        setQuery={setWalletQuery}
                        data={wallets}
                        getKey={(wallet) => wallet.id}
                        getLabel={(wallet) => wallet.name}
                        disabled={isWalletsLoading}
                    />
                )}

                {!lockType && (
                    <SegmentedTabs
                        tabs={transactionTabs}
                        selected={activeType}
                        onChange={setActiveType}
                        ariaLabel="Tipo de transacción"
                    />
                )}

                {!canShowForms && needsWalletSelect && (
                    <p className="rounded-xl border border-dashed border-light-10 bg-surface-hard/40 px-4 py-6 text-center text-sm text-helper">
                        Seleccioná una cartera para continuar.
                    </p>
                )}

                {canShowForms && activeType === "INCOME" && (
                    <IncomeForm
                        key={
                            lockType
                                ? `${mode}-income-${transaction?.id}`
                                : `income-form-${resolvedWalletId}`
                        }
                        walletId={resolvedWalletId}
                        readOnly={isViewMode}
                        transactionId={isEditMode ? transaction?.id : undefined}
                        source={transaction?.source || "manual"}
                        initialValues={sharedInitialValues}
                        onSuccess={() => handleClose(false)}
                    />
                )}

                {canShowForms && activeType === "EXPENSE" && (
                    <ExpenseForm
                        key={
                            lockType
                                ? `${mode}-expense-${transaction?.id}`
                                : `expense-form-${resolvedWalletId}`
                        }
                        walletId={resolvedWalletId}
                        readOnly={isViewMode}
                        transactionId={isEditMode ? transaction?.id : undefined}
                        source={transaction?.source || "manual"}
                        initialValues={sharedInitialValues}
                        onSuccess={() => handleClose(false)}
                    />
                )}

                {canShowForms && activeType === "TRANSFER" && (
                    <TransferForm
                        key={
                            isViewMode
                                ? `view-transfer-${transaction?.id}`
                                : `transfer-form-${resolvedWalletId}`
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
