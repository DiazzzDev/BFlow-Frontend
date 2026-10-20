import { useQuery } from "@tanstack/react-query";

import type { RecentActivityType } from "../interfaces/dashboard";
import { getRecentActivity } from "../dashboard.service";

interface UseGetRecentActivityParams {
    type: RecentActivityType;
    query: string;
    limit?: number;
}

export const useGetRecentActivity = ({
    type,
    query,
    limit = 5,
}: UseGetRecentActivityParams) => {
    return useQuery({
        queryKey: ["dashboard", "recent-activity", type, query, limit],
        queryFn: () => getRecentActivity({ type, query, limit }),
        staleTime: 1000 * 60 * 5,
    });
};
