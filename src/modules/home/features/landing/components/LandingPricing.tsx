import { LANDING_PLANS } from "../utils/landingContent";
import { useTranslation } from "react-i18next";

import { PricingCard } from "./PricingCard";


export const LandingPricing = () => {
    const { t } = useTranslation();
    const planKeys = ["personal", "pro", "annual"] as const;
    const plans = LANDING_PLANS.map((plan, index) => {
        const key = planKeys[index];
        return {
            ...plan,
            name: t(`home.plans.${key}.name`, { defaultValue: plan.name }),
            btnText: t(`home.plans.${key}.button`, { defaultValue: plan.btnText }),
            period: t(plan.period === "Año" ? "home.year" : "home.month", { defaultValue: plan.period }),
            features: t(`home.plans.${key}.features`, { returnObjects: true, defaultValue: plan.features }) as unknown as string[],
        };
    });
    return (
        <section
            id="pricing"
            className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36"
        >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                {t("home.pricingTitle")}
            </h2>
            <p className="text-sm md:text-base text-helper max-w-2xl mb-14 md:mb-16 leading-relaxed">
                {t("home.pricingDescription")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch md:pt-2">
                {plans.map((plan) => (
                    <PricingCard key={plan.name} {...plan} />
                ))}
            </div>
        </section>
    );
};
