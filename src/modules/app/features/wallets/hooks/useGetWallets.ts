import { useQuery } from "@tanstack/react-query";

import { getWallets } from "../wallet.services";

import { useAuthStore } from "@/auth/store/authStore";

export const useGetWallets = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['wallets'],
        queryFn: () => getWallets(),
        enabled: !!user,
        select: (response) => {
            const { content } = response.data;
            return {
                myWallets: content.filter(w => w.role === "OWNER"),
                sharedWallets: content.filter(w => w.role !== "OWNER"),
            };
        },
    });
};