import { CTASection } from "./components/CTASection"
import { DashboardPreview } from "./components/DashboardPreview"
import { Features } from "./components/Features"
import { Hero } from "./components/Hero"
import { HowItWorks } from "./components/HowItWorks"
import { PricingPreview } from "./components/PricingPreview"
import { Stats } from "./components/Stats"

export const LandingPage = () => {
    return (
        <div className="max-w-screen-2xl mx-auto bg-bg-main text-text-primary">
            <Hero />
            <DashboardPreview />
            <Stats />
            <Features />
            <HowItWorks />
            <PricingPreview />
            <CTASection />
        </div>
    )
}