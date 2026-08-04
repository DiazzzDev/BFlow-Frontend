import { Outlet } from "react-router-dom"

import { LandingNavbar } from "./components/LandingNavbar.tsx"
import { LandingFooter } from "./components/LandingFooter.tsx"
import { useLandingHashScroll } from "./hooks/custom/useLandingHashScroll.tsx"

export const LandingLayout = () => {
    useLandingHashScroll();
    return (
        <div className="flex flex-col min-h-screen bg-surface-hard text-light">
            <LandingNavbar />
            <div className="w-full max-w-[1440px] mx-auto flex-1">
                <Outlet />
            </div>
            <LandingFooter />
        </div>
    )

}
