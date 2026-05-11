
import { CTASection } from "./components/CTASection.tsx"
import { DashboardPreview } from "./components/DashboardPreview.tsx"
import { Features } from "./components/Features.tsx"
import { Hero } from "./components/Hero.tsx"
import { HowItWorks } from "./components/HowItWorks.tsx"
import { PricingPreview } from "./components/PricingPreview.tsx"
import { Stats } from "./components/Stats.tsx"

export const LandingPage = () => {
    return (
        <>
            <Hero />
            <DashboardPreview />
            <Stats />
            <Features />
            <HowItWorks />
            <PricingPreview />
            <CTASection />
        </>
    )
}
