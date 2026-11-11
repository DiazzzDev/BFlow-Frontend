import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postTransfer } from "../newTransaction.service";
import type { CreateTransferData } from "../interfaces/Transfer";
import { invalidateFinancialQueries } from "@/utils/query/invalidateFinancialQueries";

export const useMutateTransfers = () => {
    const queryClient = useQueryClient();

    const createTransfer = useMutation({
        mutationFn: (transferData: CreateTransferData) => postTransfer(transferData),
        onSuccess: async (_data, variables) => {
            await invalidateFinancialQueries(queryClient, [
                variables.fromWalletId,
                variables.toWalletId,
            ]);
        },
    });

    return {
        createTransfer,
    };
};
