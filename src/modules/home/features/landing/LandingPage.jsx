import { CTASection } from "./components/CTASection.jsx"
import { DashboardPreview } from "./components/DashboardPreview.jsx"
import { Features } from "./components/Features.jsx"
import { Hero } from "./components/Hero.jsx"
import { HowItWorks } from "./components/HowItWorks.jsx"
import { PricingPreview } from "./components/PricingPreview.jsx"
import { Stats } from "./components/Stats.jsx"

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