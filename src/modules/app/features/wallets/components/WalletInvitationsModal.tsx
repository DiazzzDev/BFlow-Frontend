import { toast } from "sonner";
import { Check, Mail, X } from "lucide-react";

import type { WalletInvitation } from "../interfaces/WalletInvitation";
import { useMutateWalletInvitations } from "../hooks/useMutateWalletInvitations";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { CustomModal } from "@/components/custom/CustomModal";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface WalletInvitationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    invitations: WalletInvitation[];
    isLoading: boolean;
}

const getInitials = (value: string) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return "?";
    }
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const roleLabel = (role?: string | null) => {
    const normalized = role?.trim().toUpperCase() ?? "";
    if (normalized === "OWNER") {
        return "Propietario";
    }
    if (normalized === "EDITOR" || normalized === "MEMBER") {
        return "Miembro";
    }
    if (normalized === "VIEWER") {
        return "Solo lectura";
    }
    return role?.trim() || "Miembro";
};

export const WalletInvitationsModal = ({
    isOpen,
    onClose,
    invitations,
    isLoading,
}: WalletInvitationsModalProps) => {
    const { acceptInvitation, declineInvitation } = useMutateWalletInvitations();
    const pendingInvitations = invitations.filter(
        (invitation) => invitation.status === "PENDING",
    );
    const isActing =
        acceptInvitation.isPending || declineInvitation.isPending;

    const handleAccept = async (invitation: WalletInvitation) => {
        const promise = acceptInvitation.mutateAsync(invitation.id);

        toast.promise(promise, {
            loading: "Aceptando invitación...",
            success: `Te uniste a ${invitation.walletName}`,
            error: (err) =>
                err instanceof Error ? err.message : "Error al aceptar la invitación",
        });

        try {
            await promise;
        } catch {
            // toast.promise already surfaces the error
        }
    };

    const handleDecline = async (invitation: WalletInvitation) => {
        const promise = declineInvitation.mutateAsync(invitation.id);

        toast.promise(promise, {
            loading: "Rechazando invitación...",
            success: "Invitación rechazada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al rechazar la invitación",
        });

        try {
            await promise;
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
            title="Invitaciones"
            maxWidth="max-w-lg"
        >
            <div className="flex flex-col gap-4">
                <p className="text-sm text-helper">
                    Billeteras compartidas a las que te invitaron. Acepta para
                    unirte o rechaza si no te interesa.
                </p>

                {isLoading ? (
                    <ul className="flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <li
                                key={index}
                                className="rounded-xl border border-light-10 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <SkeletonText className="h-10 w-10 shrink-0 rounded-full" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <SkeletonText className="h-4 w-40" />
                                        <SkeletonText className="h-3 w-56" />
                                        <SkeletonText className="mt-3 h-8 w-full rounded-lg" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : pendingInvitations.length === 0 ? (
                    <CustomEmptyState
                        title="Sin invitaciones"
                        description="Cuando alguien te invite a una billetera, aparecerá aquí."
                        Icon={Mail}
                        className="m-0!"
                    />
                ) : (
                    <ul className="flex max-h-[min(28rem,60vh)] flex-col gap-3 overflow-y-auto pr-0.5">
                        {pendingInvitations.map((invitation) => {
                            const inviter =
                                invitation.invitedByName?.trim() ||
                                invitation.invitedByEmail ||
                                "Alguien";

                            return (
                                <li
                                    key={invitation.id}
                                    className="rounded-xl border border-light-10 bg-surface-hard/30 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-light">
                                            {getInitials(inviter)}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-light">
                                                    {invitation.walletName || "Billetera compartida"}
                                                </p>
                                                {invitation.walletCurrency ? (
                                                    <span className="rounded-full border border-light-10 px-2 py-0.5 text-[11px] text-helper">
                                                        {invitation.walletCurrency}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="mt-1 text-xs text-helper">
                                                {inviter} te invitó
                                                {invitation.role ? (
                                                    <>
                                                        {" "}
                                                        como{" "}
                                                        <span className="text-light">
                                                            {roleLabel(invitation.role)}
                                                        </span>
                                                    </>
                                                ) : null}
                                            </p>
                                            <p className="mt-0.5 text-xs text-label">
                                                {formatterDynamicDate(
                                                    invitation.createdAt || invitation.expiresAt,
                                                ) || "—"}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isActing}
                                                    onClick={() => {
                                                        void handleDecline(invitation);
                                                    }}
                                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-light-10 px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Rechazar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isActing}
                                                    onClick={() => {
                                                        void handleAccept(invitation);
                                                    }}
                                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Aceptar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </CustomModal>
    );
};
