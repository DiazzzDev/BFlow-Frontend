import { useMutation } from "@tanstack/react-query";
import { createWompiCheckout } from "../subscription.service";

export const useCreateWompiCheckout = () => {
    return useMutation({
        mutationFn: (planId: string) => createWompiCheckout(planId),
    });
};