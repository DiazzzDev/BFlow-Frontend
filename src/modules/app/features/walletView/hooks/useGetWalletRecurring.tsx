import { useQuery } from "@tanstack/react-query";

import { getWalletRecurring } from "@/modules/app/components/scheduleTransaction/scheduleTransaction.service";
import { useAuthStore } from "@/auth/authStore";

export const useGetWalletRecurring = (walletId: string, enabled = true) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["wallet-recurring", walletId],
        queryFn: () => getWalletRecurring(walletId),
        enabled: enabled && Boolean(user) && Boolean(walletId),
        staleTime: 60_000,
    });
};
