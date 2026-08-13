import { useQuery } from "@tanstack/react-query";

import { getStatistics } from "../dashboard.service";

export const useGetStatistics = (year?: number) => {
    return useQuery({
        queryKey: ["dashboard-statistics", year],
        queryFn: () => getStatistics({ year }),
    });
};