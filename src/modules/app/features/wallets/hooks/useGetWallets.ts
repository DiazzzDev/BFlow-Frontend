import { useQuery } from "@tanstack/react-query";

import { getWallets } from "../wallet.services";

import { useAuth } from "@/auth/hooks/useAuth";

export const useGetWallets = () => {

    const auth = useAuth();

    return useQuery({
        queryKey: ['wallets'],
        
        queryFn: () =>
            getWallets(
                auth.user!.access_token
            ),

        enabled: !!auth.user?.access_token,    

        select: (response) => {
            const { content } = response.data;
            return {
                myWallets: content.filter(w => w.role === "OWNER"),
                sharedWallets: content.filter(w => w.role !== "OWNER"),
            };
        }
    });
};