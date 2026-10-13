import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

const accountUrl = `${config.API_BASE_URL}/api/v1/users/me`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const restoreAccount = async () => {
    return await apiRequest<ApiResponse<string>>(
        `${accountUrl}/deletion/cancel`,
        { ...defaultApiOptions, method: "POST" },
        "Error al restaurar la cuenta",
    );
};
