import { useQuery } from "@tanstack/react-query";

import { getBudgets } from "../budgets.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetWallets = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallets"],
        queryFn: () => getBudgets(),
        enabled: !!user,
        select: (response) => {
            const { content } = response.data;
            return content;
        },
    });
};
