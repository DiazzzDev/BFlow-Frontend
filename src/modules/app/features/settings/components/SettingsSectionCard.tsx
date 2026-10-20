import type { ReactNode } from "react";

interface SettingsSectionCardProps {
    title: string;
    description: string;
    titleClassName?: string;
    action: ReactNode;
}

export const SettingsSectionCard = ({
    title,
    description,
    titleClassName = "text-light",
    action,
}: SettingsSectionCardProps) => {
    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-light-10 bg-surface p-6 shadow-custom sm:flex-row sm:items-center">
            <div className="min-w-0">
                <h3 className={`text-base font-semibold ${titleClassName}`}>{title}</h3>
                <p className="mt-1 text-sm text-helper">{description}</p>
            </div>
            <div className="shrink-0">{action}</div>
        </div>
    );
};
