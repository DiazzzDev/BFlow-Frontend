import { Link } from "react-router";

import { authTextLinkClass } from "../utils/authStyles";

interface AuthSwitchLinkProps {
    text?: string;
    linkLabel: string;
    to: string;
    disabled?: boolean;
}

export const AuthSwitchLink = ({ text, linkLabel, to, disabled = false }: AuthSwitchLinkProps) => {
    return (
        <p>
            {text ? `${text} ` : null}
            <Link
                to={to}
                aria-disabled={disabled}
                className={`${authTextLinkClass} ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
                {linkLabel}
            </Link>
        </p>
    );
};
