import { useQuery } from "@tanstack/react-query";

import { getWalletById } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWallet = (walletId: string) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet", walletId],
        queryFn: () => getWalletById(walletId),
        enabled: !!user && !!walletId,
        staleTime: 1000 * 60 * 5,
    });
};
