import type { Category, CreateCategoryData } from "./interfaces/Category";

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

export const postCategory = async (categoryData: CreateCategoryData) => {
    return await apiRequest<ApiResponse<Category>>(
        categoriesUrl,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(categoryData),
        },
        "Error al crear la categoría",
    );
};
