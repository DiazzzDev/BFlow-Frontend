import { useMutation } from "@tanstack/react-query";

import { deleteAccount } from "../settings.service";

import type { ApiResponse } from "@/utils/api";

export const useDeleteAccount = () => {
    return useMutation<ApiResponse<string>, Error, void>({
        mutationFn: deleteAccount,
    });
};
