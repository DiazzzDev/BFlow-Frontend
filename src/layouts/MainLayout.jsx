import { Navbar } from "../components/Navbar.jsx"
import { Outlet } from "react-router"


export const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
} 