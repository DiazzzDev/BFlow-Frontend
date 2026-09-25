export type CheckoutPlanKey = "pro-monthly" | "pro-yearly";

export type WompiCheckoutPlan = {
    checkoutPlanKey?: CheckoutPlanKey;
    planId?: string;
    price: string;
};

type CheckoutApiResponse = {
    success: boolean;
    data: {
        checkoutUrl: string;
    };
};

type CheckoutDependencies = {
    createCheckout: (planId: string) => Promise<CheckoutApiResponse>;
    openCheckout: (checkoutUrl: string) => void;
};

export type WompiPlanValidation =
    | "ready"
    | "missing-plan"
    | "missing-plan-id"
    | "invalid-plan-id"
    | "invalid-price";

const PLAN_PRICES: Record<CheckoutPlanKey, string> = {
    "pro-monthly": "$9.99",
    "pro-yearly": "$99.99",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateWompiPlan = (
    plan: WompiCheckoutPlan | undefined,
): WompiPlanValidation => {
    if (!plan || !plan.checkoutPlanKey) {
        return "missing-plan";
    }

    if (plan.price !== PLAN_PRICES[plan.checkoutPlanKey]) {
        return "invalid-price";
    }

    if (!plan.planId?.trim()) {
        return "missing-plan-id";
    }

    if (!UUID_PATTERN.test(plan.planId)) {
        return "invalid-plan-id";
    }

    return "ready";
};

export const buildWompiCheckoutRequest = (planId: string): RequestInit => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
});

export const getWompiCheckoutUrl = (response: CheckoutApiResponse): string => {
    if (!response.success) {
        throw new Error("Checkout request failed");
    }

    const checkoutUrl = response.data.checkoutUrl.trim();

    if (!checkoutUrl) {
        throw new Error("Checkout URL missing");
    }

    try {
        new URL(checkoutUrl);
    } catch {
        throw new Error("Checkout URL invalid");
    }

    return checkoutUrl;
};

export const openWompiCheckoutInNewTab = (
    checkoutUrl: string,
    openWindow: typeof window.open = window.open,
): void => {
    openWindow(checkoutUrl, "_blank", "noopener,noreferrer");
};

export const executeWompiCheckout = async (
    plan: WompiCheckoutPlan | undefined,
    { createCheckout, openCheckout }: CheckoutDependencies,
): Promise<WompiPlanValidation | "redirected"> => {
    const validation = validateWompiPlan(plan);

    const planId = plan?.planId;

    if (validation !== "ready" || !planId) {
        return validation;
    }

    const response = await createCheckout(planId);
    openCheckout(getWompiCheckoutUrl(response));

    return "redirected";
};