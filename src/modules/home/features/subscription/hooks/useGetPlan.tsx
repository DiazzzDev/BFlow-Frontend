import { useQuery } from "@tanstack/react-query"
import { getPlanById } from "../subscription.service"


export const useGetPlan = (id: string) => {
    return useQuery({
        queryKey: ["plan", id],
        queryFn: () => getPlanById(id),
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 10
    })
}
