import type { LucideIcon } from "lucide-react";

import { Button } from "../controls/Button";

interface CustomEmptyStateProps {
    title: string;
    description: string;
    Icon?: LucideIcon;
    buttonText?: string;
    onButtonClick?: () => void;
    secondaryButtonText?: string;
    onSecondaryButtonClick?: () => void;
    className?: string;
}

export const CustomEmptyState = ({
    title,
    description,
    Icon,
    buttonText,
    onButtonClick,
    secondaryButtonText,
    onSecondaryButtonClick,
    className = "",
}: CustomEmptyStateProps) => {
    return (
        <div className={`flex w-full flex-1 flex-col items-center justify-center gap-1 py-8 text-center ${className}`}>
            {Icon ? <Icon className="mb-2 h-7 w-7 text-helper" strokeWidth={1.5} aria-hidden="true" /> : null}

            <p className="text-sm font-medium text-light">{title}</p>
            {description ? (
                <p className="mt-0.5 max-w-64 text-xs leading-relaxed text-helper">{description}</p>
            ) : null}

            {buttonText || secondaryButtonText ? (
                <div className="mt-4 flex items-center gap-3">
                    {buttonText && onButtonClick ? (
                        <Button text={buttonText} onClick={onButtonClick} className="px-6 py-2.5 text-sm" />
                    ) : null}
                    {secondaryButtonText ? (
                        <button
                            type="button"
                            onClick={onSecondaryButtonClick}
                            className="cursor-pointer rounded-lg border border-light-10 px-4 py-2.5 text-sm text-light transition-colors hover:bg-light-5"
                        >
                            {secondaryButtonText}
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
