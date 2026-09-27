import { GitHubFab } from "./components/GitHubFab";
import { LandingHero } from "./components/hero/LandingHero";
import { LandingSolutions } from "./components/solutions/LandingSolutions";
import { LandingHow } from "./components/how/LandingHow";
import { LandingPricing } from "./components/pricing/LandingPricing";
import { LandingFaq } from "./components/faq/LandingFaq";
import { LandingCta } from "./components/cta/LandingCta";

export const LandingPage = () => {
    return (
        <div className="flex flex-col items-center">
            <GitHubFab />
            <LandingHero />
            <LandingSolutions />
            <LandingHow />
            <LandingPricing />
            <LandingFaq />
            <LandingCta />
        </div>
    );
};
