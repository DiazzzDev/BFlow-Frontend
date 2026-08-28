import { useQuery } from "@tanstack/react-query";

import { getWalletInvitations } from "../walletInvitations.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWalletInvitations = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-invitations"],
        queryFn: () => getWalletInvitations(),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
