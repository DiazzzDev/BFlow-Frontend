import { CustomModal } from "@/components/custom/CustomModal";

interface DeleteBudgetModalProps {
    isOpen: boolean;
    budgetName: string;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteBudgetModal = ({
    isOpen,
    budgetName,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteBudgetModalProps) => {
    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Eliminar presupuesto"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-6">
                <p className="text-sm text-helper">
                    ¿Seguro que quieres eliminar{" "}
                    <span className="font-medium text-light">
                        {budgetName || "este presupuesto"}
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
