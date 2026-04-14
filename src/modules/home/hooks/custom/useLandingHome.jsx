import { useLocation, useNavigate } from "react-router-dom"

import { navLinks } from "../../constants/navLinks"

export const useLandingHome = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (id) => {
        if (pathname === "/") {
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        } else {
            navigate(`/#${id}`)
        }
    }

    return { navLinks, handleNavClick };
}