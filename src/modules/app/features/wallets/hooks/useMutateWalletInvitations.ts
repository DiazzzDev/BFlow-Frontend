import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateWalletInvitationData } from "../interfaces/WalletInvitation";
import {
    acceptWalletInvitation,
    cancelWalletInvitation,
    declineWalletInvitation,
    postWalletInvitation,
} from "../walletInvitations.service";

export const useMutateWalletInvitations = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        void queryClient.invalidateQueries({ queryKey: ["wallet-invitations"] });
        void queryClient.invalidateQueries({ queryKey: ["wallet-sent-invitations"] });
        void queryClient.invalidateQueries({ queryKey: ["wallets"] });
        void queryClient.invalidateQueries({ queryKey: ["wallet-members"] });
    };

    const inviteMember = useMutation({
        mutationFn: ({
            walletId,
            data,
        }: {
            walletId: string;
            data: CreateWalletInvitationData;
        }) => postWalletInvitation(walletId, data),
        onSuccess: invalidate,
    });

    const acceptInvitation = useMutation({
        mutationFn: (invitationId: string) => acceptWalletInvitation(invitationId),
        onSuccess: invalidate,
    });

    const declineInvitation = useMutation({
        mutationFn: (invitationId: string) => declineWalletInvitation(invitationId),
        onSuccess: invalidate,
    });

    const cancelInvitation = useMutation({
        mutationFn: (invitationId: string) => cancelWalletInvitation(invitationId),
        onSuccess: invalidate,
    });

    return {
        inviteMember,
        acceptInvitation,
        declineInvitation,
        cancelInvitation,
    };
};
