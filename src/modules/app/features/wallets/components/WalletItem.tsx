import type { ReactNode } from "react";
import { Link } from "react-router";

export interface WalletItemProps {
    children: ReactNode;
    to?: string;
    className?: string;
}

export const WalletItem = ({
    children,
    to,
    className = "",
}: WalletItemProps) => {
    const content = (
        <div
            className={`border-b border-light-10 px-1 py-4 transition-colors hover:bg-secondary/40 sm:border-b-2 sm:px-2 sm:py-6 ${className}`}
        >
            {children}
        </div>
    );

    if (to) {
        return (
            <Link to={to} className="block">
                {content}
            </Link>
        );
    }

    return content;
};
