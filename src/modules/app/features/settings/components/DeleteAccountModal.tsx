import { toast } from "sonner";

import { useDeleteAccount } from "../hooks/useDeleteAccount";

import { useLogout } from "@/auth/hooks/useLogout";
import { CustomModal } from "@/components/custom/CustomModal";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
    const deleteAccountMutation = useDeleteAccount();
    const { mutateAsync: logout } = useLogout();

    const handleConfirm = async () => {
        const promise = deleteAccountMutation.mutateAsync();

        toast.promise(promise, {
            loading: "Eliminando cuenta...",
            success: (response) => response.message || "Cuenta eliminada",
            error: (error) =>
                error instanceof Error ? error.message : "Error al eliminar la cuenta",
        });

        try {
            await promise;
            await logout();
        } catch {
            // toast.promise already surfaces the error.
        }
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Eliminar cuenta"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-6">
                <p className="text-sm text-helper">
                    Esta acción desactivará tu cuenta. Tus datos no se eliminarán físicamente,
                    pero ya no podrás acceder a ellos.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={deleteAccountMutation.isPending}
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={deleteAccountMutation.isPending}
                        onClick={() => {
                            void handleConfirm();
                        }}
                        className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleteAccountMutation.isPending ? "Eliminando..." : "Eliminar cuenta"}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
