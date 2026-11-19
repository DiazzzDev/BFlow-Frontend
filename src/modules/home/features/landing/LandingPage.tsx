import { GitHubFab } from "./components/GitHubFab";
import { LandingHero } from "./components/hero/LandingHero";
import { LandingPricing } from "./components/pricing/LandingPricing";
import { LandingOpenSource } from "./components/openSource/LandingOpenSource";
import { LandingIntegrations } from "./components/integrations/LandingIntegrations";
import { LandingFaq } from "./components/faq/LandingFaq";
import { LandingCta } from "./components/cta/LandingCta";

export const LandingPage = () => {
    return (
        <div className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-surface-hard text-light">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(116,101,255,0.08),transparent_44%),linear-gradient(to_bottom,transparent_0%,var(--color-surface-hard)_76%)]" />
            <GitHubFab />
            <LandingHero />
            <LandingIntegrations />
            <LandingPricing />
            <LandingOpenSource />
            <LandingFaq />
            <LandingCta />
        </div>
    );
};
