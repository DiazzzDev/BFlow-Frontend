import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";
import { buildWompiCheckoutRequest } from "./utils";
import { Plan } from "../landing/interfaces/Plan";

const checkoutUrl = `${config.API_BASE_URL}/api/v1/subscriptions/checkout`;

type CheckoutResponse = {
    subscriptionId: string;
    checkoutUrl: string;
};

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const createWompiCheckout = async (planId: string) => {
    return await apiRequest<ApiResponse<CheckoutResponse>>(
        checkoutUrl,
        buildWompiCheckoutRequest(planId),
        "Error al generar el pago",
    );
};

export const getPlanById = async (planId: string) => {
    return await apiRequest<ApiResponse<Plan>>(
        `${config.API_BASE_URL}/api/v1/plans/${planId}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al generar el pago",
    );
};