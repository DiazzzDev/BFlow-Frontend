import { Outlet } from "react-router";

import { LandingNavbar } from "./components/LandingNavbar";
import { LandingFooter } from "./components/LandingFooter";
import { useLandingHashScroll } from "./hooks/useLandingHashScroll";

export const LandingLayout = () => {
    useLandingHashScroll();

    return (
        <div className="flex flex-col min-h-screen bg-surface-hard text-light">
            <LandingNavbar />
            <div className="w-full max-w-360 mx-auto flex-1">
                <Outlet />
            </div>
            <LandingFooter />
        </div>
    );
};
