import { ChevronRight, Receipt, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import type { RecentActivityItem } from "../interfaces/dashboard";
import {
    dashboardCardClass,
    dashboardLabelClass,
} from "../utils/dashboardCard";

import { ActivityFilters, type ActivityFilter } from "./ActivityFilters";
import { RecentActivityRow } from "./RecentActivityRow";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { Input } from "@/components/controls/Input";

interface RecentActivityCardProps {
    isLoading: boolean;
    activities: RecentActivityItem[];
    currency: string;
    onViewAll?: () => void;
    activityType: ActivityFilter;
    activityQuery: string;
    onActivityTypeChange: (filter: ActivityFilter) => void;
    onActivityQueryChange: (query: string) => void;
}

export const RecentActivityCard = ({
    isLoading,
    activities,
    currency,
    onViewAll,
    activityType,
    activityQuery,
    onActivityTypeChange,
    onActivityQueryChange,
}: RecentActivityCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const hasActivityFilters = activityType !== "ALL" || activityQuery.trim().length > 0;

    // Navigate to wallets history (or custom handler)
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
                <p className={dashboardLabelClass}>
                    {t("dashboard.recentActivity")}
                </p>
                <button
                    type="button"
                    onClick={handleViewAll}
                    className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                    {t("dashboard.viewAll")}
                </button>
            </div>

            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="relative block w-full min-w-0 sm:flex-1 lg:max-w-100">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-helper" aria-hidden="true" />
                    <Input
                        id="dashboard-activity-search"
                        type="search"
                        value={activityQuery}
                        onChange={(event) => onActivityQueryChange(event.target.value)}
                        placeholder={t("dashboard.activitySearch")}
                        aria-label={t("dashboard.activitySearch")}
                        className="h-9 rounded-full bg-surface-hard pl-8 pr-3 text-xs"
                    />
                </label>
                <ActivityFilters selected={activityType} onChange={onActivityTypeChange} />
            </div>

            {!isLoading && activities.length === 0 && hasActivityFilters && (
                <CustomEmptyState
                    title={t("dashboard.noMatchingActivity")}
                    description={t("dashboard.noMatchingActivityHint")}
                    Icon={Receipt}
                    className="m-0!"
                />
            )}

            {isLoading && (
                <ul className="flex flex-col">
                    {Array.from({ length: 5 }).map((_, index) => (
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

            {!isLoading && activities.length === 0 && !hasActivityFilters && (
                <CustomEmptyState
                    title={t("dashboard.noHistory")}
                    description={t("dashboard.activityHint")}
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
