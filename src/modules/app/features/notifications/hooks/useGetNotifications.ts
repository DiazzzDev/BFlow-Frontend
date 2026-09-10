import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../notifications.service";

import { useAuthStore } from "@/auth/authStore";

export const useGetNotifications = () => {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => getNotifications(),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
};
