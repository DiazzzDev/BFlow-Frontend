import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationAsRead } from "../notifications.service";

export const useMutateNotifications = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        void queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    };

    const markAsRead = useMutation({
        mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
        onSuccess: invalidate,
    });

    return { markAsRead };
};
