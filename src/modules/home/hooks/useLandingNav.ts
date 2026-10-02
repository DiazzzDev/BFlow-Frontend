import { useLocation, useNavigate } from "react-router";

import { LANDING_NAV_LINKS } from "../features/landing/utils/landingNav";
import { DOCS_BASE_PATH } from "../features/docs/utils/docsContent";

const ROUTE_LINKS: Partial<Record<string, string>> = {
    contact: "/contact",
    docs: DOCS_BASE_PATH,
};

export const useLandingNav = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (id: string) => {
        const route = ROUTE_LINKS[id];
        if (route) {
            void navigate(route);
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

    const isLinkActive = (id: string) => {
        const route = ROUTE_LINKS[id];
        return route ? pathname.startsWith(route) : false;
    };

    return { navLinks: LANDING_NAV_LINKS, handleNavClick, isLinkActive };
};
