import { useGetPlans } from "../../landing/hooks/useGetPlans";

export const useGetPlan = (id: string) => {
    const query = useGetPlans();

    return {
        ...query,
        data: query.data?.data.find((plan) => plan.id === id),
    };
};
