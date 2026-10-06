import { useMutation } from "@tanstack/react-query";

import { restoreAccount } from "@/auth/services/account.service";

export const useRestoreAccount = () => {
    return useMutation({
        mutationFn: restoreAccount,
        onSuccess: () => {
            // The sync endpoint can still return 409 while the backend finishes
            // restoring the account. A full reload reruns auth bootstrap and all
            // application queries against the restored account state.
            window.location.reload();
        },
    });
};
