import { Outlet } from "react-router"
import { Toaster } from "sonner"

import { Header } from "./components/Header.tsx"
import { Navbar } from "./components/Navbar.tsx"


export const AppLayout = () => {
    return (
        <>
            <Toaster />
            <div className="flex h-screen">
                <Navbar />
                <section className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 p-8 flex flex-col overflow-auto height-[calc(100%-4rem)]">
                        <Outlet />
                    </div>
                </section>
            </div>
        </>
    )
}
