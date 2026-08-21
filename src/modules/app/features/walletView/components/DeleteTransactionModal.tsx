import type { Transaction } from "../interfaces/Transaction";

import { CustomModal } from "@/components/custom/CustomModal";

interface DeleteTransactionModalProps {
    transaction: Transaction | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteTransactionModal = ({
    transaction,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteTransactionModalProps) => {
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
                            void onConfirm();
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
