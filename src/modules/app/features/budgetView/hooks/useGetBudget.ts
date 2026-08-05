import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { getBudgetById } from "../budgetView.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetBudget = (budgetId?: string) => {
    const user = useAuthStore((state) => state.user);

    const query = useQuery({
        queryKey: ["budget", budgetId],
        queryFn: () => getBudgetById(budgetId!),
        enabled: !!user && !!budgetId,
    });

    return {
        ...query,
        budget: query.data ?? undefined,
        isNotFound: !query.isLoading && !!budgetId && query.data === null,
    };
};

export const useBudgetRouteId = () => {
    const { id } = useParams<{ id: string }>();
    return id;
};
