import { Outlet } from "react-router-dom"

import { LandingNavbar } from "./components/LandingNavbar.tsx"
import { LandingFooter } from "./components/LandingFooter.tsx"
import { useLandingHashScroll } from "./hooks/custom/useLandingHashScroll.tsx"

export const LandingLayout = () => {
    useLandingHashScroll();
    return (
        <div className="flex flex-col">
            <LandingNavbar />
            <div className="max-w-screen-2xl mx-auto bg-surface-hard text-light flex-1">
                <Outlet />
            </div>
            <LandingFooter />
        </div>
    )

}
