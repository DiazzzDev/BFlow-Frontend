import { useQuery } from "@tanstack/react-query";

import { getBalance } from "../dashboard.service";

export const useGetBalance = () => {
    return useQuery({
        queryKey: ["dashboard-balance"],
        queryFn: getBalance,
        staleTime: 1000 * 60 * 5,
    });
};