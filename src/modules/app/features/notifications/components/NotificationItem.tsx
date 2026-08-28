import { toast } from "sonner";
import {
    AlertCircle,
    AlertTriangle,
    Bell,
    Check,
    CheckCircle2,
    Info,
} from "lucide-react";

import type { Notification } from "../interfaces/Notification";
import { useMutateNotifications } from "../hooks/useMutateNotifications";

import { Button } from "@/components/controls/Button";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface NotificationItemProps {
    notification: Notification;
}

const getTypeStyles = (type: string) => {
    const normalizedType = type.trim().toUpperCase();

    if (normalizedType.includes("SUCCESS")) {
        return {
            icon: CheckCircle2,
            iconClassName: "text-green-400",
            badgeClassName: "bg-green-500/15 text-green-300",
        };
    }

    if (normalizedType.includes("WARN")) {
        return {
            icon: AlertTriangle,
            iconClassName: "text-amber-400",
            badgeClassName: "bg-amber-500/15 text-amber-300",
        };
    }

    if (normalizedType.includes("ERROR") || normalizedType.includes("DANGER")) {
        return {
            icon: AlertCircle,
            iconClassName: "text-red-400",
            badgeClassName: "bg-red-500/15 text-red-300",
        };
    }

    if (normalizedType.includes("INFO")) {
        return {
            icon: Info,
            iconClassName: "text-sky-400",
            badgeClassName: "bg-sky-500/15 text-sky-300",
        };
    }

    return {
        icon: Bell,
        iconClassName: "text-primary",
        badgeClassName: "bg-primary/15 text-primary",
    };
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    const { markAsRead } = useMutateNotifications();
    const { icon: Icon, iconClassName, badgeClassName } = getTypeStyles(notification.type);
    const isMarking = markAsRead.isPending && markAsRead.variables === notification.id;

    const handleMarkAsRead = async () => {
        if (notification.read || isMarking) {
            return;
        }

        const promise = markAsRead.mutateAsync(notification.id);

        toast.promise(promise, {
            loading: "Marcando como leída...",
            success: "Notificación marcada como leída",
            error: (err) =>
                err instanceof Error
                    ? err.message
                    : "Error al marcar la notificación como leída",
        });

        try {
            await promise;
        } catch {
            // toast.promise already surfaces the error
        }
    };

    return (
        <article
            className={`rounded-xl border p-4 transition-colors ${
                notification.read
                    ? "border-light-10 bg-surface/40"
                    : "border-primary/25 bg-primary/5"
            }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-light-5 ${iconClassName}`}
                >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className={`text-sm font-medium ${
                                notification.read ? "text-helper" : "text-light"
                            }`}
                        >
                            {notification.title}
                        </h3>
                        {!notification.read ? (
                            <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                        ) : null}
                    </div>

                    {notification.type ? (
                        <span
                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${badgeClassName}`}
                        >
                            {notification.type}
                        </span>
                    ) : null}

                    <p className="mt-2 text-sm leading-relaxed text-helper">
                        {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-placeholder">
                        {formatterDynamicDate(notification.createdAt)}
                    </p>
                </div>
            </div>

            {!notification.read ? (
                <div className="mt-4 flex justify-end">
                    <Button
                        type="button"
                        text={isMarking ? "Marcando..." : "Marcar como leída"}
                        icon={<Check className="h-4 w-4" />}
                        disabled={isMarking}
                        onClick={() => {
                            void handleMarkAsRead();
                        }}
                        className="px-3 py-1.5 text-xs"
                    />
                </div>
            ) : null}
        </article>
    );
};
