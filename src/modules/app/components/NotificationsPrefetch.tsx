import { useGetNotifications } from "../features/notifications/hooks/useGetNotifications";
import { useGetUnreadNotificationsCount } from "../features/notifications/hooks/useGetUnreadNotificationsCount";

/**
 * Prefetch global de notificaciones al entrar al área autenticada.
 */
export const NotificationsPrefetch = () => {
    useGetNotifications();
    useGetUnreadNotificationsCount();
    return null;
};
