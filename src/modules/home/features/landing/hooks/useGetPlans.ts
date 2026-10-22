import { useQuery } from "@tanstack/react-query";

import { getPlans } from "../plans.service";

export const PLANS_QUERY_KEY = ["plans"] as const;

export const useGetPlans = () => {
    return useQuery({
        queryKey: PLANS_QUERY_KEY,
        queryFn: () => getPlans(),
        staleTime: 1000 * 60 * 10,
    });
};
