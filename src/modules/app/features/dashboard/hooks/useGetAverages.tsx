import { useQuery } from "@tanstack/react-query";

import { getAverages } from "../dashboard.service";

export const useGetAverages = () => {
    return useQuery({
        queryKey: ["dashboard-averages"],
        queryFn: getAverages,
        staleTime: 1000 * 60 * 5,
    });
};