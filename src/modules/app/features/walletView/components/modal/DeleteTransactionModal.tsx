import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useDeleteExpense } from "../../../newTransaction/hooks/useMutateExpenses";
import { useDeleteIncome } from "../../../newTransaction/hooks/useMutateIncomes";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { CustomModal } from "@/components/custom/CustomModal";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

interface DeleteTransactionModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

export const DeleteTransactionModal = ({
    transaction,
    onClose,
}: DeleteTransactionModalProps) => {
    const { t } = useTranslation();
    // Delete mutations (expense vs income)
    const deleteExpense = useDeleteExpense();
    const deleteIncome = useDeleteIncome();
    const isDeleting = deleteExpense.isPending || deleteIncome.isPending;

    // Delete by type, then close the modal
    const handleConfirm = async () => {
        if (!transaction || (transaction.type !== "EXPENSE" && transaction.type !== "INCOME")) {
            return;
        }

        const promise =
            transaction.type === "EXPENSE"
                ? deleteExpense.mutateAsync({
                    id: transaction.id,
                    walletId: transaction.walletId,
                })
                : deleteIncome.mutateAsync({
                    id: transaction.id,
                    walletId: transaction.walletId,
                });

        toast.promise(promise, {
            loading: t("transactions.deleteLoading"),
            success: (response) => getApiMessage(response, t("transactions.deleteFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
        onClose();
    };

    return (
        <CustomModal
            isModalOpen={Boolean(transaction)}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={t("transactions.delete")}
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-6">
                <p className="text-sm text-helper">
                    ¿Seguro que quieres eliminar{" "}
                    <span className="font-medium text-light">
                        {transaction?.title || "esta transacción"}
                    </span>
                    ? Esta acción no se puede deshacer.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => {
                            void handleConfirm();
                        }}
                        className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? t("transactions.deleteLoading") : t("transactions.delete")}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
