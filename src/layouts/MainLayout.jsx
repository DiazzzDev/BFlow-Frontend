import { Header } from "../components/Header.jsx"
import { Navbar } from "../components/Navbar.jsx"
import { Outlet } from "react-router"


export const MainLayout = () => {
    return (
        <div className="flex">
            <Navbar />
            <section className="flex flex-col flex-1">
                <Header />
                <div className="flex-1 p-8 flex flex-col">
                    <Outlet />
                </div>
            </section>
        </div>
    )
} 