import { useQuery } from "@tanstack/react-query";

import { getStatistics } from "../dashboard.service";
import type { StatisticsPeriod } from "../interfaces/dashboard";

export const useGetStatistics = (period: StatisticsPeriod, year?: number) => {
    return useQuery({
        queryKey: ["dashboard-statistics", period, year],
        queryFn: () => getStatistics({ period, year }),
        staleTime: 1000 * 60 * 5,
    });
};
