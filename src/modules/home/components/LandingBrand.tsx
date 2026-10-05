import { Link } from "react-router";

import BflowLogo from "@/assets/BFlow logo.svg";

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
            {/* The mark is the "B" of the wordmark, so "Flow" sits flush against it */}
            <img
                src={BflowLogo}
                alt=""
                className="h-7 w-auto transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            <span className="ml-0.5 text-lg font-bold tracking-tight text-light">Flow</span>
            <span className="ml-1.5 text-lg font-normal tracking-tight text-helper">Studio</span>
        </Link>
    );
};
