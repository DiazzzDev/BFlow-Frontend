import { useQuery } from "@tanstack/react-query";

import { getBudgetById } from "../budgetView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetBudget = (budgetId?: string) => {
    const user = useAuthStore((state) => state.user);

    const query = useQuery({
        queryKey: ["budget-detail", budgetId],
        queryFn: () => getBudgetById(budgetId!),
        enabled: !!user && !!budgetId,
        staleTime: 1000 * 60 * 5,
    });

    const budget = query.data?.data;

    return {
        ...query,
        budget,
        isNotFound: !query.isLoading && !!budgetId && !budget,
    };
};