import { useQuery } from "@tanstack/react-query";

import { getUserRecurring } from "../calendar.service";
import type { RecurringOccurrenceSource } from "../interfaces/Calendar";

import { useAuthStore } from "@/auth/authStore";

const normalizeRecurringResponse = (
    response: Awaited<ReturnType<typeof getUserRecurring>> | undefined,
): RecurringOccurrenceSource[] => {
    if (!response) {return [];}
    if (Array.isArray(response)) {
        return response;
    }

    return response.data ?? [];
};

export const useGetCalendarRecurring = () => {
    const user = useAuthStore((state) => state.user);

    const query = useQuery({
        queryKey: ["calendar-recurring"],
        queryFn: () => getUserRecurring(),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });

    return {
        ...query,
        recurring: normalizeRecurringResponse(query.data),
    };
};
