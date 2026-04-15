import { Outlet } from "react-router"

import { Header } from "./components/Header.jsx"
import { Navbar } from "./components/Navbar.jsx"


export const MainLayout = () => {
    return (
        <div className="flex h-screen">
            <Navbar />
            <section className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-8 flex flex-col overflow-auto height-[calc(100%-4rem)]">
                    <Outlet />
                </div>
            </section>
        </div>
    )
} 