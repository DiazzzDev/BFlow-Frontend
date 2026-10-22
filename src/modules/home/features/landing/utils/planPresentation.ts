import type { TFunction } from "i18next";

import type { Plan, PlanBenefit, PlanBenefitDom, PlanBillingPeriod } from "../interfaces/Plan";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

export interface PricingPlanView {
    id: string;
    code: string;
    name: string;
    priceLabel: string;
    periodLabel: string;
    features: PlanBenefitDom[];
    btnText: string;
    btnStyle: "outline" | "filled";
    featured: boolean;
    isFree: boolean;
}

export const isFreePlan = (plan: Plan) => plan.price <= 0;

export const getPlanType = (plan: Plan): "free" | "monthly" | "yearly" => {
    if (plan.billingPeriod === "YEARLY") {
        return plan.price <= 0 ? "free" : "yearly";
    }
    return plan.price <= 0 ? "free" : "monthly";
};

export const billingPeriodKey = (period: PlanBillingPeriod | undefined) =>
    period && period === "YEARLY" ? "home.year" : "home.month";

export const formatPlanBenefitLabel = (benefit: PlanBenefit): PlanBenefitDom | null => {
    if (!benefit.enabled) {
        return null;
    }

    if (benefit.limitable) {
        return {
            limit: benefit.limit,
            defaultValue: benefit.name
        };
    }

    return { defaultValue: benefit.name };
};

export const getEnabledBenefitLabels = (plan: Plan): PlanBenefitDom[] =>
    plan.benefits
        .map((benefit: PlanBenefit) => formatPlanBenefitLabel(benefit))
        .filter((benefit): benefit is PlanBenefitDom => benefit !== null);

export const sortPlansForDisplay = (plans: Plan[]) =>
    [...plans].sort((left, right) => {
        if (isFreePlan(left) !== isFreePlan(right)) {
            return isFreePlan(left) ? -1 : 1;
        }

        if (left.billingPeriod !== right.billingPeriod) {
            return left.billingPeriod === "MONTHLY" ? -1 : 1;
        }

        return left.price - right.price;
    });

export const isFeaturedPlan = (plan: Plan, plans: Plan[]) => {
    if (isFreePlan(plan) || plan.billingPeriod !== "MONTHLY") {
        return false;
    }

    const monthlyPaidPlans = plans.filter(
        (candidate) => !isFreePlan(candidate) && candidate.billingPeriod === "MONTHLY",
    );

    if (monthlyPaidPlans.length === 0) {
        return false;
    }

    const featured = [...monthlyPaidPlans].sort((left, right) => left.price - right.price)[0];
    return featured?.id === plan.id;
};

export const mapPlanToPricingView = (plan: Plan, plans: Plan[], t: TFunction): PricingPlanView => {
    const currentPlanType = getPlanType(plan);
    const catalogNameKey = `plans.catalog.${plan.code}.name`;
    const catalogButtonKey = `plans.catalog.${plan.code}.button`;

    let btnText = "";

    switch (currentPlanType) {
        case "free":
            btnText = t("home.plans.startFree");
            break;
        case "monthly":
            btnText = t("home.plans.startMonth");
            break;
        case "yearly":
            btnText = t(catalogButtonKey, { defaultValue: t("home.plans.startYear") });
            break;
    }

    return {
        id: plan.id,
        code: plan.code,
        name: t(catalogNameKey, { defaultValue: plan.name }),
        priceLabel: currentPlanType === "free" ? formatCurrency(0) : formatCurrency(plan.price),
        periodLabel: t(billingPeriodKey(plan.billingPeriod)),
        features: getEnabledBenefitLabels(plan),
        btnText,
        btnStyle: isFeaturedPlan(plan, plans) ? "filled" : "outline",
        featured: isFeaturedPlan(plan, plans),
        isFree: currentPlanType === "free",
    };
};

export const mapPlansToPricingViews = (plans: Plan[], t: TFunction) =>
    sortPlansForDisplay(plans).map((plan) => mapPlanToPricingView(plan, plans, t));
