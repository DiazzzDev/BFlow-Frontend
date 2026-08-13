import { useQuery } from "@tanstack/react-query";

import { getSpending } from "../dashboard.service";

export const useGetSpending = () => {
    return useQuery({
        queryKey: ["dashboard-spending"],
        queryFn: getSpending,
    });
};