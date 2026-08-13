import { Receipt } from "lucide-react";

import type { RecentActivityItem } from "../interfaces/dashboard";
import { RecentActivityRow } from "./RecentActivityRow";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface RecentActivityCardProps {
    isLoading: boolean;
    activities: RecentActivityItem[];
    currency: string;
    onViewAll?: () => void;
}

export const RecentActivityCard = ({
    isLoading,
    activities,
    currency,
    onViewAll,
}: RecentActivityCardProps) => {
    return (
        <div className="flex flex-col rounded-lg border border-light-10 bg-surface p-5">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-helper">Recent activity</p>
                <button
                    type="button"
                    onClick={onViewAll}
                    className="cursor-pointer text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                >
                    View all
                </button>
            </div>

            {isLoading && (
                <ul className="flex flex-col">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <li key={index} className="flex items-center gap-3 border-b border-light-10 py-3 last:border-b-0">
                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-skeleton" />
                            <div className="flex-1">
                                <div className="h-3.5 w-32 animate-pulse rounded-md bg-skeleton" />
                                <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-skeleton" />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && activities.length === 0 && (
                <CustomEmptyState
                    title="Sin historial"
                    description="Cuando registres movimientos, aparecerán aquí."
                    Icon={Receipt}
                    className="m-0!"
                />
            )}

            {!isLoading && activities.length > 0 && (
                <ul className="flex flex-col">
                    {activities.map((activity, index) => (
                        <RecentActivityRow
                            key={`${activity.name}-${activity.createdAt}-${index}`}
                            activity={activity}
                            currency={currency}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};