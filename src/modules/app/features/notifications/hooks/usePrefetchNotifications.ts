import { useGetNotifications } from "./useGetNotifications";
import { useGetUnreadNotificationsCount } from "./useGetUnreadNotificationsCount";

// Warms the notifications query cache when the authenticated app shell mounts
export const usePrefetchNotifications = () => {
    useGetNotifications();
    useGetUnreadNotificationsCount();
};
