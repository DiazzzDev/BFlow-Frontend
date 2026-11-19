import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/auth/authStore";
import { useGetPlans } from "./useGetPlans";

export const useStartProCheckout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const authStatus = useAuthStore((state) => state.authStatus);
    const { data: plansResponse, refetch } = useGetPlans();

    return async (billingPeriod: "MONTHLY" | "YEARLY" = "MONTHLY") => {
        const cachedPlans = Array.isArray(plansResponse?.data) ? plansResponse.data : [];
        const response = cachedPlans.length > 0 ? undefined : await refetch();
        const plans = cachedPlans.length > 0
            ? cachedPlans
            : Array.isArray(response?.data?.data) ? response.data.data : [];
        const proPlan = plans.find((plan) =>
            plan.price > 0 && plan.billingPeriod === billingPeriod && (/pro/i.test(plan.code) || /pro/i.test(plan.name)),
        );

        if (!proPlan) {
            void navigate("/#pricing");
            return;
        }

        if (authStatus !== "authenticated") {
            void navigate(`/auth/login?plan=${encodeURIComponent(proPlan.id)}`);
            toast.info(t("home.plans.logInToGetMessage"));
            return;
        }

        void navigate(`/plan-details?plan=${encodeURIComponent(proPlan.id)}`);
    };
};
