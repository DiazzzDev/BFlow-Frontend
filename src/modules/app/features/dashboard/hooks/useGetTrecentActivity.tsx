import { useQuery } from "@tanstack/react-query";

import { getRecentActivity } from "../dashboard.service";

export const useGetRecentActivity = () => {
    return useQuery({
        queryKey: ["dashboard-recent-activity"],
        queryFn: getRecentActivity,
        staleTime: 1000 * 60 * 5,
    });
};