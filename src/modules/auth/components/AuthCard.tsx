import type { ReactNode } from "react";

import { AuthBackLink, type AuthBackLinkProps } from "./AuthBackLink";

interface AuthCardProps {
    title: string;
    subtitle?: ReactNode;
    back?: AuthBackLinkProps;
    footer?: ReactNode;
    children: ReactNode;
}

export const AuthCard = ({ title, subtitle, back, footer, children }: AuthCardProps) => {
    return (
        <section className="relative w-full max-w-sm">
            {back ? <AuthBackLink {...back} /> : null}

            <div className="px-1 py-8 sm:px-0">
                <header className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-light">{title}</h1>
                    {subtitle ? <p className="mt-2 text-sm text-helper">{subtitle}</p> : null}
                </header>

                <div className="mt-8">{children}</div>
            </div>

            {footer ? (
                <div className="px-1 pt-6 text-center text-sm text-helper">
                    {footer}
                </div>
            ) : null}
        </section>
    );
};
