import { toast } from "sonner";
import { Clock, Mail, X } from "lucide-react";

import type { WalletSentInvitation } from "../../wallets/interfaces/WalletSentInvitation";
import { useMutateWalletInvitations } from "../../wallets/hooks/useMutateWalletInvitations";
import {
    getInvitationExpiryLabel,
    isInvitationExpired,
} from "../../wallets/utils/invitationExpiry";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface WalletSentInvitationsHistoryProps {
    invitations: WalletSentInvitation[];
    isLoading: boolean;
    canManage: boolean;
}

const statusLabel = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "Expirada";
    }
    if (status === "PENDING") {
        return "Pendiente";
    }
    if (status === "ACCEPTED") {
        return "Aceptada";
    }
    if (status === "DECLINED") {
        return "Rechazada";
    }
    return status;
};

const statusDotClass = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "bg-helper";
    }
    if (status === "PENDING") {
        return "bg-primary";
    }
    if (status === "ACCEPTED") {
        return "bg-success";
    }
    if (status === "DECLINED") {
        return "bg-danger";
    }
    return "bg-helper";
};

const statusBadgeClass = (
    status: WalletSentInvitation["status"],
    expired: boolean,
) => {
    if (expired && status === "PENDING") {
        return "border-light-10 text-helper";
    }
    if (status === "PENDING") {
        return "border-primary/30 bg-primary/10 text-primary";
    }
    if (status === "ACCEPTED") {
        return "border-success-50 bg-success-sweet text-success";
    }
    if (status === "DECLINED") {
        return "border-danger-50/50 bg-danger-sweet text-danger";
    }
    return "border-light-10 text-helper";
};

export const WalletSentInvitationsHistory = ({
    invitations,
    isLoading,
    canManage,
}: WalletSentInvitationsHistoryProps) => {
    const { cancelInvitation } = useMutateWalletInvitations();

    const handleCancel = async (invitation: WalletSentInvitation) => {
        const promise = cancelInvitation.mutateAsync(invitation.id);

        toast.promise(promise, {
            loading: "Cancelando invitación...",
            success: "Invitación cancelada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al cancelar la invitación",
        });

        try {
            await promise;
        } catch {
            // toast.promise already surfaces the error
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-4">
                        <SkeletonText className="mt-1 h-3 w-3 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2 rounded-xl border border-light-10 p-4">
                            <SkeletonText className="h-4 w-36" />
                            <SkeletonText className="h-3 w-48" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (invitations.length === 0) {
        return (
            <div className="flex h-full min-h-40 items-center justify-center">
                <CustomEmptyState
                    Icon={Mail}
                    title="Sin invitaciones enviadas"
                    description="Cuando invites a alguien, el historial aparecerá aquí."
                    className="my-0!"
                />
            </div>
        );
    }

    const sorted = [...invitations].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return (
        <ol className="relative space-y-0">
            {sorted.map((invitation, index) => {
                const expired =
                    invitation.status === "PENDING" &&
                    isInvitationExpired(invitation.expiresAt);
                const expiryLabel = getInvitationExpiryLabel(invitation.expiresAt);
                const canCancel =
                    canManage && invitation.status === "PENDING" && !expired;
                const isCancelling =
                    cancelInvitation.isPending &&
                    cancelInvitation.variables === invitation.id;
                const isLast = index === sorted.length - 1;

                return (
                    <li key={invitation.id} className="relative flex gap-4 pb-5 last:pb-0">
                        <div className="relative flex w-3 shrink-0 flex-col items-center">
                            <span
                                className={`relative z-10 mt-5 h-2.5 w-2.5 rounded-full ring-4 ring-surface-hard ${statusDotClass(
                                    invitation.status,
                                    expired,
                                )}`}
                            />
                            {!isLast ? (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-7 bottom-0 w-px bg-light-10"
                                />
                            ) : null}
                        </div>

                        <article className="min-w-0 flex-1 rounded-xl border border-light-10 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-light">
                                        {invitation.invitedUserName?.trim() || ''}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-helper">
                                        {invitation.invitedEmail}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass(
                                        invitation.status,
                                        expired,
                                    )}`}
                                >
                                    {statusLabel(invitation.status, expired)}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-helper">
                                <span>
                                    Enviada {formatterDynamicDate(invitation.createdAt)}
                                </span>
                                {expiryLabel && invitation.status === "PENDING" ? (
                                    <span
                                        className={`inline-flex items-center gap-1 ${
                                            expired ? "text-danger" : ""
                                        }`}
                                    >
                                        <Clock className="h-3.5 w-3.5" />
                                        {expiryLabel}
                                    </span>
                                ) : null}
                            </div>

                            {canCancel ? (
                                <div className="mt-3 flex justify-end">
                                    <button
                                        type="button"
                                        disabled={isCancelling}
                                        onClick={() => {
                                            void handleCancel(invitation);
                                        }}
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        {isCancelling ? "Cancelando..." : "Cancelar"}
                                    </button>
                                </div>
                            ) : null}
                        </article>
                    </li>
                );
            })}
        </ol>
    );
};
