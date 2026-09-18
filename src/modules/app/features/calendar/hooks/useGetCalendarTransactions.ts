import { useQuery } from "@tanstack/react-query";

import { getCalendarTransactions } from "../calendar.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetCalendarTransactions = (size = 300) => {
    const user = useAuthStore((state) => state.user);

    const query = useQuery({
        queryKey: ["calendar-transactions", size],
        queryFn: () => getCalendarTransactions(size),
        enabled: !!user,
        staleTime: 1000 * 60,
    });

    return {
        ...query,
        transactions: query.data?.data.content ?? [],
    };
};
