import type { Category, CreateCategoryData } from "./interfaces/Category";

import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";
import { UserProfile } from "@/auth/InternalUser";

const categoriesUrl = `${config.API_BASE_URL}/api/v1/categories`;
const profileUrl = `${config.API_BASE_URL}/api/v1/users`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

// --- /api/v1/categories ---

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

// --- /api/v1/users ---

export const patchProfilePhoto = async (formData: FormData) => {
    return await apiRequest(
        `${profileUrl}/me/picture`,
        {
            method: "PATCH",
            body: formData,
        },
        "Error al actualizar la foto de perfil",
    );
};

export const patchProfileData = async (body: { email: string; name: string }) => {
    return await apiRequest<ApiResponse<UserProfile>>(
        `${profileUrl}/me`,
        {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        },
        "Error al actualizar el perfil",
    );
};
