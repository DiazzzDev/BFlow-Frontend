import type { LucideIcon } from "lucide-react";

interface BudgetCardEmptyProps {
    Icon: LucideIcon;
    title: string;
    description: string;
}

export const BudgetCardEmpty = ({ Icon, title, description }: BudgetCardEmptyProps) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center">
            <Icon className="mb-2 h-7 w-7 text-helper" strokeWidth={1.5} />
            <p className="text-sm font-medium text-light">{title}</p>
            <p className="mt-0.5 max-w-56 text-xs leading-relaxed text-helper">
                {description}
            </p>
        </div>
    );
};
