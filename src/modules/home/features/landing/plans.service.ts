import type { Plan } from "./interfaces/Plan";

import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

const plansUrl = `${config.API_BASE_URL}/api/v1/plans`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getPlans = async (errorMessage: string) => {
    return await apiRequest<ApiResponse<Plan[]>>(
        plansUrl,
        { ...defaultApiOptions, method: "GET" },
        errorMessage,
    );
};
