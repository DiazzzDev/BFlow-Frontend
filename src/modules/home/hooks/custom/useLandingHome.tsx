import { useLocation, useNavigate } from "react-router-dom"

export const navLinks = [
    { label: "Funcionalidades", id: "features" },
    { label: "Cómo funciona", id: "how" },
    { label: "Precios", id: "pricing" },
    { label: "Acerca de", id: "dashboard-preview" },
];

export const useLandingHome = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (id: string) => {
        if (pathname === "/") {
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        } else {
            void navigate(`/#${id}`)
        }
    }

    return { navLinks, handleNavClick };
}
