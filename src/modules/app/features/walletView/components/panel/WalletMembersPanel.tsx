import { useState } from "react";
import { UserPlus } from "lucide-react";

import type { Wallet } from "../../../wallets/interfaces/Wallets";
import { useGetWalletMembers } from "../../hooks/useGetWalletMembers";
import { useGetWalletSentInvitations } from "../../hooks/useGetWalletSentInvitations";
import type { WalletMember } from "../../interfaces/WalletMember";
import { WalletMembersList } from "../WalletMembersList";
import { WalletSentInvitationsHistory } from "../WalletSentInvitationsHistory";
import { InviteWalletMemberModal } from "../modal/InviteWalletMemberModal";
import { RemoveWalletMemberModal } from "../modal/RemoveWalletMemberModal";

import { SkeletonText } from "@/components/loaders/SkeletonText";

interface WalletMembersPanelProps {
    wallet?: Wallet;
    isLoading: boolean;
}

const isOwnerRole = (role?: string | null) =>
    role?.trim().toUpperCase() === "OWNER";

export const WalletMembersPanel = ({
    wallet,
    isLoading,
}: WalletMembersPanelProps) => {
    const { data: membersResponse, isLoading: isMembersLoading } = useGetWalletMembers(
        wallet?.id ?? "",
    );
    const isOwner = isOwnerRole(wallet?.role);
    const { data: sentInvitationsResponse, isLoading: isSentInvitationsLoading } =
        useGetWalletSentInvitations(isOwner ? (wallet?.id ?? "") : "");
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<WalletMember | null>(null);

    const members = membersResponse?.data ?? [];
    const sentInvitations = sentInvitationsResponse?.data ?? [];
    const pendingCount = sentInvitations.filter(
        (invitation) => invitation.status === "PENDING",
    ).length;

    if (isLoading || !wallet) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden @2xl:flex-row">
                <div className="flex min-h-0 flex-1 flex-col border-b border-light-10 px-4 py-5 sm:px-7 @2xl:border-b-0 @2xl:border-r">
                    <SkeletonText className="mb-2 h-5 w-36" />
                    <SkeletonText className="mb-6 h-4 w-48" />
                    <SkeletonText className="h-16 w-full" />
                    <SkeletonText className="mt-2 h-16 w-full" />
                </div>
                <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-7">
                    <SkeletonText className="mb-2 h-5 w-44" />
                    <SkeletonText className="mb-6 h-4 w-40" />
                    <SkeletonText className="h-20 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden @2xl:flex-row">
            <section
                className={`flex min-h-0 min-w-0 flex-1 flex-col ${
                    isOwner
                        ? "border-b border-light-10 @2xl:border-b-0 @2xl:border-r"
                        : ""
                }`}
            >
                <div className="flex items-start justify-between gap-3 border-b border-light-10 px-4 py-5 sm:px-7">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-light">
                            Miembros actuales
                        </h2>
                        <p className="mt-1 text-sm text-helper">
                            {members.length}{" "}
                            {members.length === 1 ? "persona" : "personas"} con acceso
                            a esta billetera.
                        </p>
                    </div>
                    {isOwner ? (
                        <button
                            type="button"
                            onClick={() => setIsInviteOpen(true)}
                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-light-10 px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5"
                        >
                            <UserPlus className="h-4 w-4" />
                            Invitar
                        </button>
                    ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-7">
                    <WalletMembersList
                        members={members}
                        isLoading={isMembersLoading}
                        canManage={isOwner}
                        onRemoveMember={setMemberToRemove}
                    />
                </div>
            </section>

            {isOwner ? (
                <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                    <div className="border-b border-light-10 px-4 py-5 sm:px-7">
                        <h2 className="text-base font-semibold text-light">
                            Invitaciones enviadas
                        </h2>
                        <p className="mt-1 text-sm text-helper">
                            {pendingCount > 0
                                ? `${pendingCount} pendiente${pendingCount === 1 ? "" : "s"} de respuesta.`
                                : sentInvitations.length > 0
                                  ? "Historial de invitaciones de esta billetera."
                                  : "Todavía no enviaste invitaciones."}
                        </p>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-7">
                        <WalletSentInvitationsHistory
                            invitations={sentInvitations}
                            isLoading={isSentInvitationsLoading}
                            canManage={isOwner}
                        />
                    </div>
                </section>
            ) : null}

            {isOwner ? (
                <>
                    <InviteWalletMemberModal
                        isOpen={isInviteOpen}
                        walletId={wallet.id}
                        walletName={wallet.name}
                        onClose={() => setIsInviteOpen(false)}
                    />
                    <RemoveWalletMemberModal
                        isOpen={!!memberToRemove}
                        walletId={wallet.id}
                        member={memberToRemove}
                        onClose={() => setMemberToRemove(null)}
                    />
                </>
            ) : null}
        </div>
    );
};
