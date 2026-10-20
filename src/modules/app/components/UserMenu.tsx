import { useId } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, LogOut, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { UserAvatar } from "./UserAvatar";
import { UserMenuLanguage } from "./UserMenuLanguage";

import { useDropdown } from "../hooks/useDropdown";
import { USER_MENU_RESOURCE_LINKS } from "../utils/userMenuLinks";

import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";

const SETTINGS_PATH = "/app/settings";
const itemBaseClass = "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";
const itemClass = `${itemBaseClass} text-light hover:bg-light-5`;

export const UserMenu = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const user = useAuthStore((state) => state.user);
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
    const { isOpen, toggle, close, containerRef, triggerRef } = useDropdown();
    const panelId = useId();
    const isSettingsActive = pathname.startsWith(SETTINGS_PATH);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(t("settings.logoutSuccess"));
        } catch {
            toast.error(t("settings.logoutError"));
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                aria-label={t("userMenu.open")}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={`flex cursor-pointer rounded-full ring-2 transition-shadow ${isOpen ? "ring-primary" : "ring-transparent hover:ring-light-25"
                    }`}
            >
                <UserAvatar user={user} />
            </button>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        id={panelId}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-xl border border-light-10 bg-surface p-1.5 shadow-custom"
                    >
                        <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-light">
                                    {user?.name || user?.email}
                                </p>
                                {user?.name ? (
                                    <p className="mt-0.5 truncate text-xs text-helper">{user.email}</p>
                                ) : null}
                            </div>
                            {user ? (
                                <span className="shrink-0 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                    {t("userMenu.plan", { plan: user.subscription.planName })}
                                </span>
                            ) : null}
                        </div>

                        <hr className="my-1 border-light-10" />

                        <Link
                            to={SETTINGS_PATH}
                            onClick={close}
                            aria-current={isSettingsActive ? "page" : undefined}
                            className={itemClass}
                        >
                            <Settings className="h-4 w-4 text-helper" />
                            <span className="flex-1">{t("nav.settings")}</span>
                            {isSettingsActive ? (
                                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                    {t("userMenu.active")}
                                </span>
                            ) : null}
                        </Link>

                        <UserMenuLanguage />

                        <hr className="my-1 border-light-10" />

                        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-helper">
                            {t("userMenu.resources")}
                        </p>
                        {USER_MENU_RESOURCE_LINKS.map(({ to, labelKey, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={close}
                                className={`group ${itemClass}`}
                            >
                                <Icon className="h-4 w-4 text-helper" />
                                <span className="flex-1">
                                    {t(labelKey)}
                                    <span className="sr-only"> {t("userMenu.opensInNewTab")}</span>
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 text-helper opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ))}

                        <hr className="my-1 border-light-10" />

                        <button
                            type="button"
                            disabled={isLoggingOut}
                            onClick={() => void handleLogout()}
                            className={`${itemBaseClass} text-danger hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? t("settings.loggingOut") : t("settings.logout")}
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};
