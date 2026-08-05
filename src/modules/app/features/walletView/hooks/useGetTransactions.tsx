import { useQuery } from "@tanstack/react-query";

import { getTransactions } from "../walletView.service";
import type { TransactionType } from "../interfaces/Transaction";

import { useAuthStore } from "@/auth/authStore";

export const useGetTransactions = (
    walletId: string,
    type: TransactionType | null,
    query = "",
) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-transactions", walletId, type, query],
        queryFn: () =>
            getTransactions({
                type: type!,
                walletId,
                query,
            }),
        enabled: !!user && !!walletId && !!type,
    });
};
