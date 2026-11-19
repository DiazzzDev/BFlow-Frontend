import { useQuery } from "@tanstack/react-query";

import { getBudgetsHealth } from "../dashboard.service";

export const useGetBudgetsHealth = (enabled = true) => {
    return useQuery({
        queryKey: ["dashboard", "budgets-health"],
        queryFn: getBudgetsHealth,
        enabled,
        staleTime: 1000 * 60 * 5,
    });
};
