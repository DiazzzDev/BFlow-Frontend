import { Outlet } from "react-router-dom"

import { LandingNavbar } from "./components/LandingNavbar.jsx"
import { LandingFooter } from "./components/LandingFooter.jsx"
import { useLandingHashScroll } from "./hooks/custom/useLandingHashScroll.jsx"

export const LandingLayout = () => {
    useLandingHashScroll();
    return (
        <div className="flex flex-col">
            <LandingNavbar />
            <div className="max-w-screen-2xl mx-auto bg-bg-main text-text-primary flex-1">
                <Outlet />
            </div>
            <LandingFooter />
        </div>
    )

}