import { useQuery } from "@tanstack/react-query";

import { getWalletMembers } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWalletMembers = (walletId: string) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-members", walletId],
        queryFn: () => getWalletMembers(walletId),
        enabled: !!user && !!walletId,
        staleTime: 1000 * 60 * 5,
    });
};
