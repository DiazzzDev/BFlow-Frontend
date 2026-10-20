import { AlertCircle, AlertTriangle, Bell, CheckCircle2, Info, type LucideIcon } from "lucide-react";

import type { Notification } from "../features/notifications/interfaces/Notification";

export const NOTIFICATIONS_FILTERS = ["unread", "all"] as const;

export type NotificationsFilter = (typeof NOTIFICATIONS_FILTERS)[number];

export const NOTIFICATIONS_FILTER_LABEL_KEYS = {
    unread: "notifications.filterUnread",
    all: "notifications.filterAll",
} as const satisfies Record<NotificationsFilter, string>;

export const sortByMostRecent = (notifications: Notification[]) =>
    [...notifications].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

interface NotificationTypeStyle {
    icon: LucideIcon;
    iconClassName: string;
}

export const getNotificationTypeStyle = (type: string): NotificationTypeStyle => {
    const normalizedType = type.trim().toUpperCase();

    if (normalizedType.includes("SUCCESS")) {
        return { icon: CheckCircle2, iconClassName: "text-green-400" };
    }
    if (normalizedType.includes("WARN")) {
        return { icon: AlertTriangle, iconClassName: "text-amber-400" };
    }
    if (normalizedType.includes("ERROR") || normalizedType.includes("DANGER")) {
        return { icon: AlertCircle, iconClassName: "text-red-400" };
    }
    if (normalizedType.includes("INFO")) {
        return { icon: Info, iconClassName: "text-sky-400" };
    }

    return { icon: Bell, iconClassName: "text-primary" };
};
