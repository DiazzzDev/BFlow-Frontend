import { useLocation, useNavigate } from "react-router";

import { LANDING_NAV_LINKS } from "../features/landing/utils/landingNav";

export const useLandingNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (id: string) => {
        if (id === "contact") {
            void navigate("/contact");
            return;
        }

        if (pathname === "/") {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            void navigate(`/#${id}`);
        }
    };

    return { navLinks: LANDING_NAV_LINKS, handleNavClick };
};
