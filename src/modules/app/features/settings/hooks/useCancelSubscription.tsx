import { useMutation } from "@tanstack/react-query";

import { cancelSubscription } from "../settings.service";

export const useCancelSubscription = () => {
    return useMutation({
        mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
    });
};
