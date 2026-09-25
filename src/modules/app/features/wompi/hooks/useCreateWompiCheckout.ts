import { useMutation } from "@tanstack/react-query";

import { createWompiCheckout } from "../wompi.service";

export const useCreateWompiCheckout = () => {
    return useMutation({
        mutationFn: (planId: string) => createWompiCheckout(planId),
    });
};