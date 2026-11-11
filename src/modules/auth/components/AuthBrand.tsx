import { Link } from "react-router";

import { BflowLogo } from "@/components/brand/BflowLogo";

export const AuthBrand = () => {
    return (
        <Link
            to="/"
            aria-label="BFlow"
            className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            {/* The mark is the "B" of the wordmark, so "Flow" sits flush against it */}
            <BflowLogo className="h-7 w-auto" />
            <span className="ml-0.5 text-xl font-bold tracking-tight text-light">Flow</span>
        </Link>
    );
};
