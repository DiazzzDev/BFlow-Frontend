import { LANDING_PLANS } from "../utils/landingContent";

import { PricingCard } from "./PricingCard";


export const LandingPricing = () => {
    return (
        <section
            id="pricing"
            className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36"
        >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                Mira nuestros planes
            </h2>
            <p className="text-sm md:text-base text-helper max-w-2xl mb-14 md:mb-16 leading-relaxed">
                Todos los precios están expresados en USD. El importe final
                en moneda local dependerá del tipo de cambio aplicado por su
                banco o entidad emisora.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch md:pt-2">
                {LANDING_PLANS.map((plan) => (
                    <PricingCard key={plan.name} {...plan} />
                ))}
            </div>
        </section>
    );
};
