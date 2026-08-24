import { useQuery } from "@tanstack/react-query";

import { getWalletDetails } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWalletDetails = (walletId: string) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["walletDetails", walletId],
        queryFn: () => getWalletDetails(walletId),
        enabled: !!user && !!walletId,
    });
};
