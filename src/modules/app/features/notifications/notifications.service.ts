import type { Notification } from "./interfaces/Notification";

import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

const notificationsUrl = `${config.API_BASE_URL}/api/v1/notifications`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getNotifications = async () => {
    return await apiRequest<ApiResponse<Notification[]>>(
        notificationsUrl,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las notificaciones",
    );
};

export const getUnreadNotificationsCount = async () => {
    return await apiRequest<ApiResponse<number>>(
        `${notificationsUrl}/unread-count`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las notificaciones sin leer",
    );
};

export const markNotificationAsRead = async (notificationId: string) => {
    return await apiRequest<ApiResponse<string>>(
        `${notificationsUrl}/${notificationId}/read`,
        { ...defaultApiOptions, method: "PATCH" },
        "Error al marcar la notificación como leída",
    );
};

/** Registers or refreshes the browser's FCM token for the current user. */
export const registerDeviceToken = async (token: string) => {
    return await apiRequest<ApiResponse<void>>(
        `${notificationsUrl}/devices`,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify({ token, platform: "WEB" }),
        },
        "Error al registrar las notificaciones push",
    );
};

/** Revokes a browser FCM token when the user explicitly disables push. */
export const unregisterDeviceToken = async (token: string) => {
    return await apiRequest<ApiResponse<void>>(
        `${notificationsUrl}/devices?token=${encodeURIComponent(token)}`,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al desactivar las notificaciones push",
    );
};
