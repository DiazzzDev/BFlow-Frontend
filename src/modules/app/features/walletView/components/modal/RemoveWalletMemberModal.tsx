import { toast } from "sonner";

import type { WalletMember } from "../../interfaces/WalletMember";
import { useMutateWalletMembers } from "../../hooks/useMutateWalletMembers";

import { CustomModal } from "@/components/custom/CustomModal";

interface RemoveWalletMemberModalProps {
    isOpen: boolean;
    walletId: string;
    member: WalletMember | null;
    onClose: () => void;
}

export const RemoveWalletMemberModal = ({
    isOpen,
    walletId,
    member,
    onClose,
}: RemoveWalletMemberModalProps) => {
    const { removeMember } = useMutateWalletMembers();
    const isRemoving = removeMember.isPending;
    const displayName = member?.name?.trim() || member?.email || "este miembro";

    const handleConfirm = async () => {
        if (!member) {
            return;
        }

        const promise = removeMember.mutateAsync({
            walletId,
            memberId: member.id,
        });

        toast.promise(promise, {
            loading: "Eliminando miembro...",
            success: `${displayName} ya no forma parte de la billetera`,
            error: (err) =>
                err instanceof Error ? err.message : "Error al eliminar el miembro",
        });

        try {
            await promise;
            onClose();
        } catch {
            // toast.promise already surfaces the error
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
            title="Eliminar miembro"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-6">
                <p className="text-sm text-helper">
                    ¿Seguro que quieres quitar a{" "}
                    <span className="font-medium text-light">{displayName}</span> de
                    esta billetera? Perderá el acceso de inmediato.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isRemoving}
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isRemoving || !member}
                        onClick={() => {
                            void handleConfirm();
                        }}
                        className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isRemoving ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
