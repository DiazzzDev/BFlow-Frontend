import { useQuery } from "@tanstack/react-query";

import { getWalletTransactions } from "../walletView.service";

import type { TransactionType } from "@/modules/app/interfaces/Transaction";
import { useAuthStore } from "@/auth/authStore";

export const useGetTransactions = (
    walletId: string,
    type: TransactionType | null,
    query = "",
    page = 0,
    size = 5,
) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-transactions", walletId, type, query, page, size],
        queryFn: () =>
            getWalletTransactions(walletId, {
                type: type!,
                query,
                page,
                size,
            }),
        enabled: !!user && !!walletId && !!type,
        staleTime: 1000 * 60 * 5,
    });
};
