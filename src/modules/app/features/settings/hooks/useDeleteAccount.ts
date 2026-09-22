import { useMutation } from "@tanstack/react-query";

import { deleteAccount } from "../settings.service";

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: deleteAccount,
    });
};
