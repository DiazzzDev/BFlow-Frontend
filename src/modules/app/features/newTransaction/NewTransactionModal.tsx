import { useState } from "react";

import { useGetWallets } from "../wallets/hooks/useGetWallets";

import { ExpenseForm } from "./forms/ExpenseForm";
import { IncomeForm } from "./forms/IncomeForm";
import { TransferForm } from "./forms/TransferForm";
import {
    getTransactionModalContentKey,
    getTransactionModalMaxWidth,
    resolveInitialTransactionType,
} from "./utils/transactionModal";
import { getVisibleTransactionTypeTabs } from "./utils/tabs/transactionTypeTabs";
import {
    getTransactionFormInitialValues,
    getTransferFormInitialValues,
} from "./utils/transactionFormInitialValues";
import {
    getTransactionModalTitle,
    type TransactionModalMode,
} from "./utils/transactionModalTitles";

import type {
    Transaction,
    TransactionType,
} from "@/modules/app/interfaces/Transaction";
import { TRANSACTION_TYPE_VALUES } from "@/modules/app/interfaces/Transaction";
import type { Wallet } from "@/modules/app/interfaces/Wallet";
import { CustomModal } from "@/components/custom/CustomModal";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSelect } from "@/hooks/useAutoSelect";

const EMPTY_WALLETS: Wallet[] = [];

interface NewTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId?: string;
    /** When true (or when create mode has no walletId), show a wallet picker. */
    requireWalletSelect?: boolean;
    initialType?: TransactionType | null;
    allowedTypes?: readonly TransactionType[];
    mode?: TransactionModalMode;
    transaction?: Transaction | null;
}

// Shell: title/size + remount content when the modal opens or the target transaction changes
export const NewTransactionModal = ({
    isModalOpen,
    setIsModalOpen,
    walletId = "",
    requireWalletSelect,
    initialType = null,
    allowedTypes,
    mode = "create",
    transaction = null,
}: NewTransactionModalProps) => {
    const visibleTypes = allowedTypes ?? TRANSACTION_TYPE_VALUES;
    const headingType = resolveInitialTransactionType(
        mode,
        transaction,
        initialType,
        visibleTypes,
    );

    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title={getTransactionModalTitle(mode, headingType)}
            maxWidth={getTransactionModalMaxWidth(visibleTypes, headingType)}
        >
            <NewTransactionModalContent
                key={getTransactionModalContentKey(
                    isModalOpen,
                    mode,
                    transaction?.id,
                    initialType,
                )}
                walletId={walletId}
                requireWalletSelect={requireWalletSelect}
                initialType={initialType}
                allowedTypes={allowedTypes}
                mode={mode}
                transaction={transaction}
                onClose={() => setIsModalOpen(false)}
            />
        </CustomModal>
    );
};

interface NewTransactionModalContentProps {
    walletId: string;
    requireWalletSelect?: boolean;
    initialType?: TransactionType | null;
    allowedTypes?: readonly TransactionType[];
    mode: TransactionModalMode;
    transaction?: Transaction | null;
    onClose: () => void;
}

const NewTransactionModalContent = ({
    walletId,
    requireWalletSelect,
    initialType = null,
    allowedTypes,
    mode,
    transaction = null,
    onClose,
}: NewTransactionModalContentProps) => {
    // Mode flags: view/edit lock type + wallet; create may need a wallet picker
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const lockType = isViewMode || isEditMode;
    const needsWalletSelect = requireWalletSelect ?? (mode === "create" && !walletId);

    // Visible transaction type tabs
    const visibleTypes = allowedTypes ?? TRANSACTION_TYPE_VALUES;
    const visibleTabs = getVisibleTransactionTypeTabs(visibleTypes);
    const [activeType, setActiveType] = useState<TransactionType>(() =>
        resolveInitialTransactionType(
            mode,
            transaction,
            initialType,
            visibleTypes,
        ),
    );

    // Wallet search (debounced) for the optional picker
    const [walletQuery, setWalletQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);
    const { data: walletsResponse, isFetching: isWalletsFetching } = useGetWallets("MINE", debouncedWalletQuery, 0, 20,);
    const wallets = walletsResponse?.data.content ?? EMPTY_WALLETS;

    // UI selection: "auto" = first wallet; manual pick leaves auto mode
    const { selectedItem: selectedWallet, setSelection: setSelectedWallet, } = useAutoSelect(wallets, needsWalletSelect);

    // Resolve which walletId the forms receive
    const resolvedWalletId = lockType && transaction ? transaction.walletId : needsWalletSelect ? (selectedWallet?.id ?? "") : walletId;

    const canShowForms = Boolean(resolvedWalletId);
    const sharedInitialValues = lockType && transaction ? getTransactionFormInitialValues(transaction) : undefined;

    return (
        <div className="flex flex-col gap-6">
            {needsWalletSelect && (
                <SelectAutoComplete<Wallet>
                    idSelect="transactionWalletId"
                    label="Cartera"
                    placeholder={
                        isWalletsFetching
                            ? "Buscando carteras..."
                            : "Seleccionar cartera..."
                    }
                    selectedItem={selectedWallet}
                    setSelectedItem={setSelectedWallet}
                    query={walletQuery}
                    setQuery={setWalletQuery}
                    data={wallets}
                    getKey={(wallet) => wallet.id}
                    getLabel={(wallet) => wallet.name}
                />
            )}

            {!lockType && (
                <SegmentedTabs
                    tabs={visibleTabs}
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
                    onSuccess={onClose}
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
                    onSuccess={onClose}
                />
            )}

            {canShowForms &&
                activeType === "TRANSFER" &&
                visibleTypes.includes("TRANSFER") && (
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
                                ? getTransferFormInitialValues(transaction)
                                : undefined
                        }
                        onSuccess={onClose}
                    />
                )}
        </div>
    );
};
