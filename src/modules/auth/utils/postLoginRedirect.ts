const PENDING_PLAN_KEY = "bflow.pendingPlanId";

export const getPostLoginPath = (planId: string | null) => {
    if (!planId) {
        return "/app/dashboard";
    }

    return `/plan-details?plan=${encodeURIComponent(planId)}`;
};

export const savePendingPlan = (planId: string | null) => {
    if (planId) {
        window.sessionStorage.setItem(PENDING_PLAN_KEY, planId);
        return;
    }

    window.sessionStorage.removeItem(PENDING_PLAN_KEY);
};

export const consumePendingPlan = () => {
    const planId = window.sessionStorage.getItem(PENDING_PLAN_KEY);
    window.sessionStorage.removeItem(PENDING_PLAN_KEY);
    return planId;
};
