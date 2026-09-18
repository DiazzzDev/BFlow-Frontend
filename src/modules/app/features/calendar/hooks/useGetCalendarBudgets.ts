import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { enrichBudgetWithRange } from "../utils/budgetRange";

import { getBudgets } from "@/modules/app/features/budgets/budgets.service";
import { useAuthStore } from "@/auth/authStore";

/** Reuses the existing budgets endpoint/service — no parallel budgets model.
 * A generous page size keeps this a single request for the calendar's
 * typical case (a handful of active budgets per user). */
export const useGetCalendarBudgets = (size = 100) => {
    const user = useAuthStore((state) => state.user);

    const query = useQuery({
        queryKey: ["calendar-budgets", size],
        queryFn: () => getBudgets({ page: 0, size }),
        enabled: !!user,
        staleTime: 1000 * 60,
    });

    const budgets = useMemo(
        () => (query.data?.data.content ?? []).map(enrichBudgetWithRange),
        [query.data],
    );

    return { ...query, budgets };
};
