import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useGetNotifications } from "../hooks/useGetNotifications";

import { NotificationItem } from "./NotificationItem";

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

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Cerrar notificaciones"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 cursor-default bg-transparent"
                    />

                    <motion.aside
                        role="dialog"
                        aria-label="Notificaciones"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 top-[calc(100%+0.75rem)] z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-light-10 bg-surface-hard shadow-custom max-[420px]:fixed max-[420px]:left-2 max-[420px]:right-2 max-[420px]:top-16 max-[420px]:w-auto"
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-light-10 px-4 py-3">
                            <div>
                                <h2 className="text-sm font-semibold text-light">
                                    Notificaciones
                                </h2>
                            </div>

                            {unreadCount > 0 ? (
                                <span className="text-[11px] text-helper">
                                    {unreadCount} sin leer
                                </span>
                            ) : null}
                        </div>

                        <div className="min-h-0 max-h-[min(30rem,calc(100vh-8rem))] overscroll-contain overflow-y-auto">
                            {isLoading ? (
                                <div className="space-y-1 px-4 py-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-light-10 py-3 last:border-b-0"
                                        >
                                            <SkeletonText className="mb-2 h-3.5 w-2/3" />
                                            <SkeletonText className="mb-2 h-3 w-full" />
                                            <SkeletonText className="h-2.5 w-1/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex min-h-40 flex-col items-center justify-center px-6 py-8 text-center">
                                    <p className="text-sm font-medium text-light">
                                        No hay notificaciones
                                    </p>
                                    <p className="mt-1 text-xs text-helper">
                                        Cuando tengas novedades, aparecerán aquí.
                                    </p>
                                </div>
                            ) : (
                                <div>
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
                </>
            ) : null}
        </AnimatePresence>
    );
};
