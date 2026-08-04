import { useLocation, useNavigate } from "react-router"

export const navLinks = [
    { label: "Características", id: "how" },
    { label: "Precios", id: "pricing" },
    { label: "Preguntas frecuentes", id: "faq" },
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
