import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postBudget } from "../budgets.service";
import type { CreateBudgetData } from "../interfaces/Budget";

export const useMutateBudgets = () => {
    const queryClient = useQueryClient();

    const createBudget = useMutation({
        mutationFn: (budgetData: CreateBudgetData) => postBudget(budgetData),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["budgets"] });
        },
    });

    return {
        createBudget,
    };
};
