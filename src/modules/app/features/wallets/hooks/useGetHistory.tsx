import { useQuery } from "@tanstack/react-query";

import { getHistory } from "../wallets.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetHistory = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["history"],
        queryFn: () => getHistory(),
        enabled: !!user,
    });
};
