export type PlanBillingPeriod = "MONTHLY" | "YEARLY";

export interface PlanBenefit {
    code: string;
    name: string;
    limitable: boolean;
    limit: number;
    enabled: boolean;
}

export interface PlanBenefitDom {
    defaultValue: string;
    limit?: number;
}

export interface Plan {
    id: string;
    code: string;
    name: string;
    price: number;
    billingPeriod: PlanBillingPeriod;
    benefits: PlanBenefit[];
}
