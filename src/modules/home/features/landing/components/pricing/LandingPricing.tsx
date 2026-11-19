import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PricingCard } from "./PricingCard";
import { PricingPlansSkeleton } from "./PricingPlansSkeleton";

import { useGetPlans } from "@/modules/home/features/landing/hooks/useGetPlans";
import { mapPlansToPricingViews } from "@/modules/home/features/landing/utils/planPresentation";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { WalletCards } from "lucide-react";

export const LandingPricing = () => {
    const { t } = useTranslation();
    const { data: plansResponse, isLoading, isError, refetch } = useGetPlans();

    const plans = useMemo(
        () => mapPlansToPricingViews(plansResponse?.data ?? [], t),
        [plansResponse?.data, t],
    );

    return (
        <section id="pricing" className="w-full max-w-7xl px-4 pb-20 pt-10 sm:px-8 md:pb-28" aria-labelledby="pricing-title">
            <h2 id="pricing-title" className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">{t("home.pricingTitle")}</h2>
            <p className="mb-10 max-w-2xl text-sm leading-relaxed text-helper md:mb-12 md:text-base">
                {t("home.pricingDescription")}
            </p>
            {isLoading ? (
                <PricingPlansSkeleton />
            ) : isError ? (
                <CustomEmptyState
                    Icon={WalletCards}
                    title={t("home.plans.errorTitle")}
                    buttonText={t("home.plans.reloadBtnText")}
                    onButtonClick={() => { void refetch() }}
                />
            ) : plans.length === 0 ? (
                <CustomEmptyState
                    Icon={WalletCards}
                    title={t("home.plans.emptyTitle")}
                    description={t("home.plans.emptyDescription")}
                />
            ) : (
                <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:pt-2 lg:gap-6">
                    {plans.map((plan) => (
                        <PricingCard key={plan.id} {...plan} />
                    ))}
                </div>
            )}
        </section>
    );
};
