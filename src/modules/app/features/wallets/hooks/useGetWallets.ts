import { useQuery } from "@tanstack/react-query";

import { getWallets } from "../wallet.services";

export const useGetWallets = () => {
    return useQuery({
        queryKey: ['wallets'],
        queryFn: getWallets,
        select: (response) => {
            const { content } = response.data;
            return {
                myWallets: content.filter(w => w.role === "OWNER"),
                sharedWallets: content.filter(w => w.role !== "OWNER"),
            };
        }
    });
};