import { useQuery } from "@tanstack/react-query";

import { getWallets } from "../wallets.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWallets = (
    scope: "MINE" | "SHARED",
    query = "",
    page = 0,
    size = 5,
) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallets", scope, query, page, size],
        queryFn: () => getWallets({ scope, query, page, size }),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
