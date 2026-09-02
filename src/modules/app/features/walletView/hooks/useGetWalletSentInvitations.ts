import { useQuery } from "@tanstack/react-query";

import { getSentWalletInvitations } from "../../wallets/walletInvitations.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWalletSentInvitations = (walletId: string) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-sent-invitations", walletId],
        queryFn: () => getSentWalletInvitations(walletId),
        enabled: !!user && !!walletId,
        staleTime: 1000 * 60 * 5,
    });
};
