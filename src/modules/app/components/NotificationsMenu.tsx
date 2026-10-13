import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NotificationsMenuFilters } from "./NotificationsMenuFilters";
import { NotificationsMenuItem } from "./NotificationsMenuItem";

import { useGetNotifications } from "../features/notifications/hooks/useGetNotifications";
import { useGetUnreadNotificationsCount } from "../features/notifications/hooks/useGetUnreadNotificationsCount";
import { useDropdown } from "../hooks/useDropdown";
import { sortByMostRecent, type NotificationsFilter } from "../utils/notificationsMenu";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";

const SKELETON_ROWS = 3;
const MAX_BADGE_COUNT = 99;

export const NotificationsMenu = () => {
    const { t } = useTranslation();
    const { isOpen, toggle, containerRef, triggerRef } = useDropdown();
    const [filter, setFilter] = useState<NotificationsFilter>("unread");
    const panelId = useId();

    const { data: notificationsResponse, isLoading } = useGetNotifications();
    const { data: unreadCountResponse } = useGetUnreadNotificationsCount();

    const notifications = useMemo(
        () => sortByMostRecent(notificationsResponse?.data ?? []),
        [notificationsResponse],
    );
    const unreadNotifications = notifications.filter((notification) => !notification.read);
    const unreadCount = unreadCountResponse?.data ?? unreadNotifications.length;
    const visibleNotifications = filter === "unread" ? unreadNotifications : notifications;

    const handleToggle = () => {
        if (!isOpen) {
            setFilter("unread");
        }
        toggle();
    };

    return (
        <div ref={containerRef} className="sm:relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                aria-label={t("a11y.notifications")}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`relative cursor-pointer rounded-lg p-2 transition-colors hover:bg-light-5 hover:text-light ${isOpen ? "bg-light-5 text-light" : "text-helper"
                    }`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                    <span className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-light">
                        {unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : unreadCount}
                    </span>
                ) : null}
            </button>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        id={panelId}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed inset-x-4 top-18 z-50 flex origin-top-right flex-col rounded-xl border border-light-10 bg-surface shadow-custom sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96"
                    >
                        <div className="flex flex-col gap-3 border-b border-light-10 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-semibold text-light">{t("notifications.title")}</h2>
                                    {unreadCount > 0 ? (
                                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                            {t("notifications.newCount", { count: unreadCount })}
                                        </span>
                                    ) : null}
                                </div>

                                {unreadCount > 0 ? (
                                    <button
                                        type="button"
                                        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                                    >
                                        <CheckCheck className="h-3.5 w-3.5" />
                                        {t("notifications.markAllRead")}
                                    </button>
                                ) : null}
                            </div>

                            <NotificationsMenuFilters value={filter} onChange={setFilter} unreadCount={unreadCount} />
                        </div>

                        <div className="max-h-[min(24rem,60dvh)] overflow-y-auto p-1.5">
                            {isLoading ? (
                                <div className="flex flex-col gap-1">
                                    {Array.from({ length: SKELETON_ROWS }, (_, index) => (
                                        <div key={index} className="flex gap-3 px-3 py-2.5">
                                            <SkeletonText className="h-9 w-9 shrink-0 rounded-lg!" />
                                            <div className="flex flex-1 flex-col gap-2">
                                                <SkeletonText className="h-3.5 w-2/3" />
                                                <SkeletonText className="h-3 w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : visibleNotifications.length === 0 ? (
                                filter === "unread" ? (
                                    <CustomEmptyState
                                        Icon={CheckCheck}
                                        title={t("notifications.nothingPending")}
                                        description={t("notifications.nothingPendingHint")}
                                    />
                                ) : (
                                    <CustomEmptyState
                                        Icon={Bell}
                                        title={t("notifications.empty")}
                                        description={t("notifications.emptyHint")}
                                    />
                                )
                            ) : (
                                <ul className="flex flex-col gap-0.5">
                                    {visibleNotifications.map((notification) => (
                                        <NotificationsMenuItem key={notification.id} notification={notification} />
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="border-t border-light-10 p-2">
                            <button
                                type="button"
                                className="w-full cursor-pointer rounded-lg border border-light-10 bg-light-5 px-3 py-2 text-sm font-medium text-helper transition-colors hover:border-light-25 hover:text-light"
                            >
                                {t("notifications.viewAll")}
                            </button>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};
