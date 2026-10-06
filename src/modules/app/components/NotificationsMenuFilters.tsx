import { useTranslation } from "react-i18next";

import {
    NOTIFICATIONS_FILTER_LABEL_KEYS,
    NOTIFICATIONS_FILTERS,
    type NotificationsFilter,
} from "../utils/notificationsMenu";

interface NotificationsMenuFiltersProps {
    value: NotificationsFilter;
    onChange: (filter: NotificationsFilter) => void;
    unreadCount: number;
}

export const NotificationsMenuFilters = ({ value, onChange, unreadCount }: NotificationsMenuFiltersProps) => {
    const { t } = useTranslation();

    return (
        <div
            role="group"
            aria-label={t("notifications.filterLabel")}
            className="flex w-fit rounded-lg border border-light-10 bg-surface-hard p-0.5"
        >
            {NOTIFICATIONS_FILTERS.map((filter) => {
                const isActive = filter === value;

                return (
                    <button
                        key={filter}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(filter)}
                        className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${isActive ? "bg-primary text-light" : "text-helper hover:text-light"
                            }`}
                    >
                        {t(NOTIFICATIONS_FILTER_LABEL_KEYS[filter])}
                        {filter === "unread" ? ` (${unreadCount})` : null}
                    </button>
                );
            })}
        </div>
    );
};
