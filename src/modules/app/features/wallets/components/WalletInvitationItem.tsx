import { toast } from "sonner";
import { Check, Clock, Wallet, X } from "lucide-react";

import type { WalletInvitation } from "../interfaces/WalletInvitation";
import { useMutateWalletInvitations } from "../hooks/useMutateWalletInvitations";
import {
    getInvitationExpiryLabel,
    isInvitationExpired,
} from "../utils/invitationExpiry";

interface WalletInvitationItemProps {
    invitation: WalletInvitation;
}

const getInitials = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "?";
    }

    if (trimmed.includes("@")) {
        return trimmed.slice(0, 2).toUpperCase();
    }

    const parts = trimmed.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const WalletInvitationItem = ({ invitation }: WalletInvitationItemProps) => {
    const { acceptInvitation, declineInvitation } = useMutateWalletInvitations();
    const inviterName = invitation.invitedByName?.trim() || invitation.invitedByEmail || "Alguien";
    const expired = isInvitationExpired(invitation.expiresAt);
    const expiryLabel = getInvitationExpiryLabel(invitation.expiresAt);
    const isActing =
        (acceptInvitation.isPending && acceptInvitation.variables === invitation.id) ||
        (declineInvitation.isPending && declineInvitation.variables === invitation.id);

    const handleAccept = async () => {
        if (expired || isActing) {
            return;
        }

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

    const handleDecline = async () => {
        if (isActing) {
            return;
        }

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
        <article
            className={`overflow-hidden rounded-2xl border ${
                expired
                    ? "border-light-10 bg-surface/40"
                    : "border-primary/20 bg-primary/5"
            }`}
        >
            <div className="flex items-center gap-3 border-b border-light-10/80 px-4 py-3">
                {invitation.invitedByPictureUrl ? (
                    <img
                        src={invitation.invitedByPictureUrl}
                        alt={inviterName}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-light">
                        {getInitials(inviterName)}
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-light">{inviterName}</p>
                    {invitation.invitedByEmail ? (
                        <p className="truncate text-xs text-helper">
                            {invitation.invitedByEmail}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="px-4 py-4">
                <p className="text-xs text-helper">Te invitó a unirte a</p>

                <div className="mt-2 flex items-start gap-2">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-light-5 text-primary">
                        <Wallet className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-light">
                            {invitation.walletName || "Billetera compartida"}
                        </h3>
                        {invitation.invitedEmail ? (
                            <p className="mt-0.5 truncate text-xs text-label">
                                Enviada a {invitation.invitedEmail}
                            </p>
                        ) : null}
                    </div>
                </div>

                {expiryLabel ? (
                    <p
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs ${
                            expired ? "text-danger" : "text-helper"
                        }`}
                    >
                        <Clock className="h-3.5 w-3.5" />
                        {expiryLabel}
                    </p>
                ) : null}

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        disabled={isActing}
                        onClick={() => {
                            void handleDecline();
                        }}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-light-10 px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                        Rechazar
                    </button>
                    <button
                        type="button"
                        disabled={isActing || expired}
                        onClick={() => {
                            void handleAccept();
                        }}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Check className="h-4 w-4" />
                        {expired ? "Expirada" : "Unirme"}
                    </button>
                </div>
            </div>
        </article>
    );
};
