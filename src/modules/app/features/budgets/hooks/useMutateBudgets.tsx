import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBudget, patchBudget, postBudget } from "../budgets.service";
import type { CreateBudgetData, UpdateBudgetData } from "../interfaces/Budget";

const invalidateBudgetQueries = (
    queryClient: ReturnType<typeof useQueryClient>,
    budgetId?: string,
) => {
    void queryClient.invalidateQueries({ queryKey: ["budgets"] });
    if (budgetId) {
        void queryClient.invalidateQueries({ queryKey: ["budget-detail", budgetId] });
    }
};

export const useMutateBudgets = () => {
    const queryClient = useQueryClient();

    const createBudget = useMutation({
        mutationFn: (budgetData: CreateBudgetData) => postBudget(budgetData),
        onSuccess: () => {
            invalidateBudgetQueries(queryClient);
        },
    });

    const updateBudget = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateBudgetData;
        }) => patchBudget(id, data),
        onSuccess: (_data, variables) => {
            invalidateBudgetQueries(queryClient, variables.id);
        },
    });

    const removeBudget = useMutation({
        mutationFn: (id: string) => deleteBudget(id),
        onSuccess: (_data, id) => {
            invalidateBudgetQueries(queryClient, id);
        },
    });

    return {
        createBudget,
        updateBudget,
        removeBudget,
    };
};
