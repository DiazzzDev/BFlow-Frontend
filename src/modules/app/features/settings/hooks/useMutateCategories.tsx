import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCategory } from "../settings.service";

import type { CreateCategoryData } from "@/modules/app/interfaces/Category";

export const useMutateCategories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryData: CreateCategoryData) => postCategory(categoryData),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};
