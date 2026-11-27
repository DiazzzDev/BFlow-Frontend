import { Link } from "react-router";

import { BflowLogo } from "@/components/brand/BflowLogo";

interface LandingBrandProps {
    onClick?: () => void;
}

export const LandingBrand = ({ onClick }: LandingBrandProps) => {
    return (
        <Link
            to="/"
            onClick={onClick}
            aria-label="BFlow Studio"
            className="group flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            <BflowLogo
                className="h-7 w-auto transition-transform duration-300 group-hover:-translate-x-0.5"
            />
        </Link>
    );
};
