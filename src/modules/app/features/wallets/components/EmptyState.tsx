import type { ReactNode } from "react";

interface EmptyStateProps {
    Button?: ReactNode;
    titleText: string;
    descriptionText: string;
    Icon: ReactNode;
}

export const EmptyState = ({ Button, titleText, descriptionText, Icon }: EmptyStateProps) => (
    <div className="flex flex-col items-center justify-center py-12 gap-4 border border-dashed border-border rounded-xl col-span-full">
        <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center">
            {Icon}
        </div>
        <div className="text-center">
            <p className="text-foreground font-medium">{titleText}</p>
            <p className="text-sm text-label mt-1">{descriptionText}</p>
        </div>
        {Button ? Button : null}
    </div>
)
