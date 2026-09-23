import { GitHubFab } from "./components/GitHubFab";
import { LandingHero } from "./components/LandingHero";
import { LandingHow } from "./components/LandingHow";
import { LandingPricing } from "./components/LandingPricing";
import { LandingFaq } from "./components/LandingFaq";
import { useLandingPage } from "./hooks/useLandingPage";

export const LandingPage = () => {
    const page = useLandingPage();

    return (
        <>
            <GitHubFab />

            <LandingHero
                isChecking={page.isChecking}
                isAuthenticated={page.isAuthenticated}
            />

            <LandingHow
                activeStep={page.activeStep}
                onSelectStep={page.selectStep}
                onPauseChange={page.setPaused}
            />

            <LandingPricing isAuthenticated={page.isAuthenticated} />

            <LandingFaq
                openFaq={page.openFaq}
                onToggleFaq={page.toggleFaq}
            />
        </>
    );
};
