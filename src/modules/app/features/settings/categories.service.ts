import type { Category } from "./interfaces/Category";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const categoriesUrl = `${config.API_BASE_URL}/api/v1/categories`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
    path?: string;
};

export const getCategories = async () => {
    return await apiRequest<ApiResponse<Category[]>>(
        categoriesUrl,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las categorías",
    );
};
