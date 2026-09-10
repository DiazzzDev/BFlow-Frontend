import { useQuery } from "@tanstack/react-query";

import { getBudgets } from "../budgets.service";
import type { GetBudgetsParams } from "../interfaces/Budget";

import { useAuthStore } from "@/auth/authStore";

export const useGetBudgets = (filters: GetBudgetsParams = {}) => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["budgets", filters],
        queryFn: () => getBudgets(filters),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
