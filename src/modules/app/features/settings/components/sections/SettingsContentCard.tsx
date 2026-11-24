import type { ReactNode } from "react";

interface SettingsContentCardProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export const SettingsContentCard = ({
    title,
    description,
    children,
}: SettingsContentCardProps) => (
    <section className="rounded-2xl border border-light-10 bg-surface [background-image:var(--surface-gradient)] p-5 shadow-custom sm:p-7">
        <header className={description ? "mb-6" : "mb-5"}>
            <h2 className="text-lg font-semibold text-light">{title}</h2>
            {description ? <p className="mt-1 text-sm text-helper">{description}</p> : null}
        </header>
        {children}
    </section>
);
