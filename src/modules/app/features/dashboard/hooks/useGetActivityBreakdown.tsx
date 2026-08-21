import { useQuery } from "@tanstack/react-query";

import { getActivityBreakdown } from "../dashboard.service";

export const useGetActivityBreakdown = () => {
    return useQuery({
        queryKey: ["dashboard-activity-breakdown"],
        queryFn: getActivityBreakdown,
    });
};
