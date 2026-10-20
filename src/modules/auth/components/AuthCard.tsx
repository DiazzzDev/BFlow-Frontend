import type { ReactNode } from "react";

import { AuthBackLink, type AuthBackLinkProps } from "./AuthBackLink";
import { AuthBrand } from "./AuthBrand";

interface AuthCardProps {
    title: string;
    subtitle?: ReactNode;
    back?: AuthBackLinkProps;
    footer?: ReactNode;
    children: ReactNode;
}

export const AuthCard = ({ title, subtitle, back, footer, children }: AuthCardProps) => {
    return (
        <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-light-10 bg-surface shadow-custom">
            {back ? <AuthBackLink {...back} /> : null}

            <div className="px-6 py-8 sm:px-8">
                <header className="flex flex-col items-center text-center">
                    <AuthBrand />
                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-light">{title}</h1>
                    {subtitle ? <p className="mt-2 text-sm text-helper">{subtitle}</p> : null}
                </header>

                <div className="mt-7">{children}</div>
            </div>

            {footer ? (
                <div className="border-t border-light-10 bg-surface-hard/50 px-6 py-4 text-center text-sm text-helper sm:px-8">
                    {footer}
                </div>
            ) : null}
        </section>
    );
};
