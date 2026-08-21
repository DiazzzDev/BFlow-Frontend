import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postCategory } from "../categories.service";
import type { CreateCategoryData } from "../interfaces/Category";

export const useMutateCategories = () => {
    const queryClient = useQueryClient();

    const createCategory = useMutation({
        mutationFn: (categoryData: CreateCategoryData) => postCategory(categoryData),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return {
        createCategory,
    };
};
