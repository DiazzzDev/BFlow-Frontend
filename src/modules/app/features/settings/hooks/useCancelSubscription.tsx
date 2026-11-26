import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelSubscription } from "../settings.service";

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] }),
    });
};
