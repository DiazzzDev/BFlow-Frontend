import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeWalletMember } from "../walletView.service";

export const useMutateWalletMembers = () => {
    const queryClient = useQueryClient();

    const invalidate = (walletId: string) => {
        void queryClient.invalidateQueries({ queryKey: ["wallet-members", walletId] });
        void queryClient.invalidateQueries({ queryKey: ["wallet-sent-invitations", walletId] });
        void queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
        void queryClient.invalidateQueries({ queryKey: ["wallets"] });
    };

    const removeMember = useMutation({
        mutationFn: ({
            walletId,
            memberId,
        }: {
            walletId: string;
            memberId: string;
        }) => removeWalletMember(walletId, memberId),
        onSuccess: (_data, variables) => {
            invalidate(variables.walletId);
        },
    });

    return {
        removeMember,
    };
};
