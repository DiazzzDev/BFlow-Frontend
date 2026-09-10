import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";

import { useGetNotifications } from "../hooks/useGetNotifications";

import { NotificationItem } from "./NotificationItem";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";

interface NotificationsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationsSidebar = ({
    isOpen,
    onClose,
}: NotificationsSidebarProps) => {
    const { data: notificationsResponse, isLoading } = useGetNotifications();
    const notifications = notificationsResponse?.data ?? [];
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-50">
                    <motion.button
                        type="button"
                        aria-label="Cerrar notificaciones"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-surface-hard/70 backdrop-blur-[1px]"
                    />

                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-light-10 bg-surface shadow-custom"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-light-10 px-5 py-4">
                            <div>
                                <h2 className="text-base font-semibold text-light">
                                    Notificaciones
                                </h2>
                                <p className="mt-0.5 text-xs text-helper">
                                    {unreadCount > 0
                                        ? `${unreadCount} sin leer`
                                        : "Estás al día"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar panel de notificaciones"
                                className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-light-10 p-4"
                                        >
                                            <SkeletonText className="mb-2 h-4 w-2/3" />
                                            <SkeletonText className="mb-2 h-3 w-full" />
                                            <SkeletonText className="h-3 w-1/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : notifications.length === 0 ? (
                                <CustomEmptyState
                                    Icon={Bell}
                                    title="Sin notificaciones"
                                    description="Cuando tengas novedades, las verás aquí."
                                    className="my-0!"
                                />
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </div>
            ) : null}
        </AnimatePresence>,
        document.body,
    );
};
