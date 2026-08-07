import { useQuery } from "@tanstack/react-query";

import { getOverview } from "../walletView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetOverview = (walletId: string, query = "", enabled = true) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-overview", walletId, query],
        queryFn: () => getOverview(walletId, query),
        enabled: !!user && !!walletId && enabled,
    });
};
