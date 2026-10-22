import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getPlans } from "../plans.service";

export const PLANS_QUERY_KEY = ["plans"] as const;

export const useGetPlans = () => {
    const { t } = useTranslation();

    return useQuery({
        queryKey: PLANS_QUERY_KEY,
        queryFn: () => getPlans(t("home.plans.fetchError")),
        staleTime: 1000 * 60 * 10,
    });
};
