import type { Category, CreateCategoryData } from "@/modules/app/interfaces/Category";
import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";
import type { UserProfile } from "@/auth/InternalUser";

const categoriesUrl = `${config.API_BASE_URL}/api/v1/categories`;
const profileUrl = `${config.API_BASE_URL}/api/v1/users`;
const subscriptionsUrl = `${config.API_BASE_URL}/api/v1/subscriptions`;
const gmailIntegrationUrl = `${config.API_BASE_URL}/api/v1/integrations/gmail`;

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
    return await apiRequest(
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

export type UpdateProfileData = {
    email: string;
    name: string;
    language?: string;
};

export const patchProfileData = async (body: UpdateProfileData) => {
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

export const deleteAccount = async () => {
    return await apiRequest<ApiResponse<string>>(
        `${profileUrl}/me`,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al eliminar la cuenta",
    );
};

// --- /api/v1/subscriptions ---

export const cancelSubscription = async (subscriptionId: string) => {
    return await apiRequest<ApiResponse<void>>(
        `${subscriptionsUrl}/${subscriptionId}/cancel`,
        { ...defaultApiOptions, method: "PATCH" },
        "Error al cancelar la suscripción",
    );
};

// --- /api/v1/integrations/gmail ---

export type GmailConnectionStatus = "CONNECTED" | "DISCONNECTED" | "REVOKED";

export interface GmailStatus {
    connected: boolean;
    status: GmailConnectionStatus;
}

export interface GmailSyncData {
    walletId?: string;
    lookbackDays?: number;
    maxMessages?: number;
    dryRun?: boolean;
}

export interface GmailSyncResult {
    messagesFound: number;
    compatibleAttachments: number;
    queuedForProcessing: number;
}

export const getGmailStatus = async () => {
    return await apiRequest<ApiResponse<GmailStatus>>(
        `${gmailIntegrationUrl}/status`,
        { ...defaultApiOptions, method: "GET" },
        "Error al consultar la conexión de Gmail",
    );
};

export const getGmailConnectUrl = async () => {
    return await apiRequest<ApiResponse<string>>(
        `${gmailIntegrationUrl}/connect`,
        { ...defaultApiOptions, method: "GET" },
        "Error al iniciar la conexión con Gmail",
    );
};

export const syncGmail = async (data: GmailSyncData = {}) => {
    return await apiRequest<ApiResponse<GmailSyncResult>>(
        `${gmailIntegrationUrl}/sync`,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(data),
        },
        "Error al sincronizar Gmail",
    );
};

export const disconnectGmail = async () => {
    return await apiRequest<void>(
        gmailIntegrationUrl,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al desconectar Gmail",
    );
};
