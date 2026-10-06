import { Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import type { Notification } from "../features/notifications/interfaces/Notification";
import { useMutateNotifications } from "../features/notifications/hooks/useMutateNotifications";
import { getNotificationTypeStyle } from "../utils/notificationsMenu";

import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { getApiErrorMessage } from "@/utils/api/apiMessage";

interface NotificationsMenuItemProps {
    notification: Notification;
}

export const NotificationsMenuItem = ({ notification }: NotificationsMenuItemProps) => {
    const { t } = useTranslation();
    const { markAsRead } = useMutateNotifications();
    const { icon: Icon, iconClassName } = getNotificationTypeStyle(notification.type);
    const isUnread = !notification.read;

    const handleMarkAsRead = async () => {
        if (!isUnread || markAsRead.isPending) {
            return;
        }
        try {
            await markAsRead.mutateAsync(notification.id);
        } catch (error) {
            toast.error(getApiErrorMessage(error, t("common.operationError")));
        }
    };

    return (
        <li>
            <div
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${isUnread ? "hover:bg-light-5" : ""}`}
            >
                <span
                    className={`relative self-start mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-light-10 bg-surface-hard ${iconClassName}`}
                >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {isUnread ? (
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-primary" />
                    ) : null}
                </span>

                <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-medium ${isUnread ? "text-light" : "text-helper"}`}>
                        {notification.title}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-helper">{notification.message}</span>
                    <span className="mt-1 block text-[11px] text-placeholder">
                        {formatterDynamicDate(notification.createdAt)}
                    </span>
                </span>
                {isUnread ? (
                    <button
                        type="button"
                        onClick={() => void handleMarkAsRead()}
                        disabled={markAsRead.isPending}
                        title={t("notifications.markAsRead")}
                        aria-label={t("notifications.markAsRead")}
                        className="mt-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-light-10 text-helper transition-colors hover:border-light-25 hover:text-light-25 hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                ) : null}
            </div>
        </li>
    );
};