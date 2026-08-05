import { useQuery } from "@tanstack/react-query";

import { getWalletById } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWallet = (walletId?: string) => {
    const user = useAuthStore((state) => state.user);
    console.log(walletId, user)
    const query = useQuery({
        queryKey: ["wallet", walletId],
        queryFn: () => getWalletById(walletId!),
        enabled: !!user && !!walletId,
    });

    return {
        ...query,
        wallet: query.data ?? undefined,
        isNotFound: !query.isLoading && !!walletId && query.data === null,
    };
};

