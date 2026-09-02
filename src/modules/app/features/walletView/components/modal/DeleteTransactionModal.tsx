import { toast } from "sonner";

import { useDeleteExpense } from "../../../../components/newTransaction/hooks/useMutateExpenses";
import { useDeleteIncome } from "../../../../components/newTransaction/hooks/useMutateIncomes";
import type { Transaction } from "../../interfaces/Transaction";

import { CustomModal } from "@/components/custom/CustomModal";

interface DeleteTransactionModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

export const DeleteTransactionModal = ({
    transaction,
    onClose,
}: DeleteTransactionModalProps) => {
    const deleteExpense = useDeleteExpense();
    const deleteIncome = useDeleteIncome();
    const isDeleting = deleteExpense.isPending || deleteIncome.isPending;

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
            loading: "Eliminando transacción...",
            success: "Transacción eliminada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al eliminar la transacción",
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
            title="Eliminar transacción"
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
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
