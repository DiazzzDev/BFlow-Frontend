import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useMutateNotifications } from "../hooks/useMutateNotifications";
import type { Notification } from "../interfaces/Notification";

import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface NotificationItemProps {
    notification: Notification;
}

const getTypeTone = (type: string) => {
    const normalizedType = type.trim().toUpperCase();

    if (normalizedType.includes("SUCCESS")) {
        return "bg-success";
    }

    if (normalizedType.includes("WARN")) {
        return "bg-warning";
    }

    if (normalizedType.includes("ERROR") || normalizedType.includes("DANGER")) {
        return "bg-danger";
    }

    if (normalizedType.includes("INFO")) {
        return "bg-info";
    }

    return "bg-primary";
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const { t } = useTranslation();
    const { markAsRead } = useMutateNotifications();
    const typeTone = getTypeTone(notification.type);
    const isMarking = markAsRead.isPending && markAsRead.variables === notification.id;

    const handleMarkAsRead = async () => {
        if (notification.read || isMarking) {
            return;
        }

        const promise = markAsRead.mutateAsync(notification.id);

        toast.promise(promise, {
            loading: t("notifications.markLoading"),
            success: (response) => getApiMessage(response, t("notifications.markFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        try {
            await promise;
        } catch {
            // toast.promise already surfaces the error
        }
    };

    return (
        <article
            className={`border-b border-light-10 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-light-5 ${
                notification.read ? "bg-transparent" : "bg-light-5/45"
            }`}
        >
            <div className="flex items-start gap-2.5">
                <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full opacity-75 ${typeTone}`}
                    aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                    <h3
                        className={`truncate text-[13px] font-medium ${
                            notification.read ? "text-helper" : "text-light"
                        }`}
                    >
                        {notification.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-helper">
                        {notification.message}
                    </p>

                    <p className="mt-1 text-[11px] text-placeholder">
                        {formatterDynamicDate(notification.createdAt)}
                    </p>

                    {!notification.read ? (
                        <button
                            type="button"
                            disabled={isMarking}
                            onClick={() => {
                                void handleMarkAsRead();
                            }}
                            className="mt-1.5 inline-flex rounded-md px-2 py-1 text-[11px] font-medium text-helper transition-colors hover:bg-primary-15 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isMarking ? t("notifications.markLoading") : t("notifications.markRead")}
                        </button>
                    ) : null}
                </div>
            </div>
        </article>
    );
};
