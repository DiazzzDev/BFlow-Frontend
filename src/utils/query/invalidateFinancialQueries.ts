import type { QueryClient } from "@tanstack/react-query";

const uniqueWalletIds = (walletIds: string[]) => [...new Set(walletIds.filter(Boolean))];

export const invalidateFinancialQueries = async (
    queryClient: QueryClient,
    walletIds: string[] = [],
) => {
    const ids = uniqueWalletIds(walletIds);
    const walletQueryKeys = ids.length > 0
        ? ids.flatMap((walletId) => [
            ["wallet-overview", walletId],
            ["wallet-transactions", walletId],
            ["wallet", walletId],
            ["walletDetails", walletId],
        ])
        : [["wallet-overview"], ["wallet-transactions"], ["wallet"], ["walletDetails"]];

    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["budgets"] }),
        queryClient.invalidateQueries({ queryKey: ["budget-detail"] }),
        queryClient.invalidateQueries({ queryKey: ["history"] }),
        queryClient.invalidateQueries({ queryKey: ["wallets"] }),
        ...walletQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    ]);
};
