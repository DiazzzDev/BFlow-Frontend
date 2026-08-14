import { ChevronRight, Receipt } from "lucide-react";
import { useNavigate } from "react-router";

import type { RecentActivityItem } from "../interfaces/dashboard";
import { dashboardCardClass } from "../utils/dashboardCard";

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
    const navigate = useNavigate();

    const handleViewAll = () => {
        if (onViewAll) {
            onViewAll();
            return;
        }
        void navigate("/app/wallets");
    };

    return (
        <div className={dashboardCardClass}>
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-helper">Recent activity</p>
                <button
                    type="button"
                    onClick={handleViewAll}
                    className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                    View all
                </button>
            </div>

            {isLoading && (
                <ul className="flex flex-col">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-3 border-b border-light-10 py-3.5 last:border-b-0"
                        >
                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-skeleton" />
                            <div className="flex-1">
                                <div className="h-3.5 w-32 animate-pulse rounded-md bg-skeleton" />
                                <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-skeleton" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-transparent" />
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
