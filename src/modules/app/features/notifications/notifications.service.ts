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
