import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

import { buildWompiCheckoutRequest } from "./wompi.checkout";

const checkoutUrl = `${config.API_BASE_URL}/api/v1/subscriptions/checkout`;

type CheckoutResponse = {
    subscriptionId: string;
    checkoutUrl: string;
};

export const createWompiCheckout = async (planId: string) => {
    return await apiRequest<ApiResponse<CheckoutResponse>>(
        checkoutUrl,
        buildWompiCheckoutRequest(planId),
        "Error al generar el pago",
    );
};