import { useQuery } from "@tanstack/react-query";

import { getOverview } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetOverview = (
    walletId: string,
    query = "",
    enabled = true,
    page = 0,
    size = 5,
) => {
    const user = useAuthStore((state) => state.user);
    return useQuery({
        queryKey: ["wallet-overview", walletId, query, page, size],
        queryFn: () => getOverview(walletId, { query, page, size }),
        enabled: !!user && !!walletId && enabled,
        staleTime: 1000 * 60 * 5,
    });
};
