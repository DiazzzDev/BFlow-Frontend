import { useQuery } from "@tanstack/react-query";

import { searchWalletCollaborators } from "../walletInvitations.service";

import { useAuthStore } from "@/auth/authStore";

export const useSearchWalletCollaborators = (
    walletId: string,
    query = "",
) => {
    const user = useAuthStore((state) => state.user);
    const trimmedQuery = query.trim();

    return useQuery({
        queryKey: ["wallet-collaborators-search", walletId, trimmedQuery],
        queryFn: () => searchWalletCollaborators(walletId, trimmedQuery),
        enabled: !!user && !!walletId && trimmedQuery.length >= 2,
        staleTime: 1000 * 60 * 5,
    });
};
