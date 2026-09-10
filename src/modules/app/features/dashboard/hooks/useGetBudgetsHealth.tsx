import { useQuery } from "@tanstack/react-query";

import { getBudgetsHealth } from "../dashboard.service";

export const useGetBudgetsHealth = () => {
    return useQuery({
        queryKey: ["dashboard-budgets-health"],
        queryFn: getBudgetsHealth,
        staleTime: 1000 * 60 * 5,
    });
};