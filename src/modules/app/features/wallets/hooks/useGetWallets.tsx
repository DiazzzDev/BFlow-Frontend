import { useQuery } from "@tanstack/react-query";

import { getWallets } from "../wallets.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWallets = (scope: "MINE" | "SHARED", query = "") => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallets", scope, query],
        queryFn: () => getWallets(scope, query),
        enabled: !!user,
    });
};
