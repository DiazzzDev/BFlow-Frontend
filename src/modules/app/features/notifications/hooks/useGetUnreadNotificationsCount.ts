import { useQuery } from "@tanstack/react-query";

import { getUnreadNotificationsCount } from "../notifications.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetUnreadNotificationsCount = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["notifications-unread-count"],
        queryFn: () => getUnreadNotificationsCount(),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
