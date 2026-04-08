import { Outlet } from "react-router-dom"

import { LandingNavbar } from "./components/LandingNavbar.jsx"
import { LandingFooter } from "./components/LandingFooter.jsx"

export const LandingLayout = () => {
    return (
        <>
            <LandingNavbar />
            <Outlet />
            <LandingFooter />
        </>
    )

}