import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Bell, LogOut, Menu, User } from "lucide-react";

import { NotificationsSidebar } from "../features/notifications/components/NotificationsSidebar";
import { useGetUnreadNotificationsCount } from "../features/notifications/hooks/useGetUnreadNotificationsCount";
import { getBreadcrumbs } from "../utils/breadcrumbs";

import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";

interface HeaderProps {
    onOpenNav: () => void;
}

export const Header = ({ onOpenNav }: HeaderProps) => {
    const { pathname } = useLocation();
    const crumbs = getBreadcrumbs(pathname);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const { data: unreadCountResponse } = useGetUnreadNotificationsCount();
    const unreadCount = unreadCountResponse?.data ?? 0;
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!profileOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setProfileOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [profileOpen]);

    const closeProfileMenu = () => setProfileOpen(false);

    return (
        <header className="flex items-center justify-between gap-2 border-b border-light-10 bg-surface-hard px-3 py-3 text-light sm:gap-3 sm:px-6 lg:px-8 lg:py-5">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={onOpenNav}
                    aria-label="Abrir menú"
                    className="shrink-0 cursor-pointer rounded-lg p-2 text-helper transition-colors hover:bg-light-5 hover:text-light lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="flex min-w-0 items-center gap-2 text-sm font-medium sm:text-lg">
                    {crumbs.map((crumb, index) => {
                        const isLast = index === crumbs.length - 1;

                        return (
                            <span className="flex min-w-0 items-center gap-2" key={index}>
                                {index > 0 && (
                                    <span className="shrink-0 text-helper">/</span>
                                )}

                                {!isLast && crumb.path ? (
                                    <Link
                                        to={crumb.path}
                                        className="truncate text-helper transition-colors hover:text-light"
                                    >
                                        {crumb.text}
                                    </Link>
                                ) : (
                                    <span
                                        className={`truncate ${
                                            isLast
                                                ? "font-medium text-light"
                                                : "text-helper"
                                        }`}
                                    >
                                        {crumb.text}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <div className="relative">
                    <button
                        type="button"
                        className={`relative cursor-pointer rounded-lg p-2 transition-colors ${
                            notificationsOpen
                                ? "bg-light-10 text-light"
                                : "text-helper hover:bg-light-5 hover:text-light"
                        }`}
                        onClick={() => {
                            setNotificationsOpen((open) => !open);
                            setProfileOpen(false);
                        }}
                        aria-label="Notificaciones"
                        aria-expanded={notificationsOpen}
                        aria-haspopup="dialog"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 ? (
                            <span className="absolute right-1 top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-light">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        ) : null}
                    </button>

                    <NotificationsSidebar
                        isOpen={notificationsOpen}
                        onClose={() => setNotificationsOpen(false)}
                    />
                </div>

                <div className="relative" ref={profileMenuRef}>
                    <button
                        type="button"
                        onClick={() => {
                            setProfileOpen((open) => !open);
                            setNotificationsOpen(false);
                        }}
                        aria-label="Abrir menú de usuario"
                        aria-expanded={profileOpen}
                        aria-haspopup="menu"
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-shadow ${
                            profileOpen
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-hard"
                                : ""
                        }`}
                    >
                        {user?.pictureUrl ? (
                            <img
                                src={user.pictureUrl}
                                alt={user.name || user.email || "Usuario"}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center bg-secondary text-light">
                                <User className="h-5 w-5" />
                            </span>
                        )}
                    </button>

                    {profileOpen ? (
                        <div
                            role="menu"
                            aria-label="Menú de usuario"
                            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-light-10 bg-surface-hard p-2 shadow-custom max-[420px]:fixed max-[420px]:left-2 max-[420px]:right-2 max-[420px]:top-16 max-[420px]:w-auto"
                        >
                            <div className="border-b border-light-10 px-3 py-2.5">
                                <p className="truncate text-sm font-medium text-light">
                                    {user?.name || "BFlow"}
                                </p>
                                <p className="truncate text-xs text-helper">
                                    {user?.email || "Cuenta personal"}
                                </p>
                            </div>

                            <div className="py-1">
                                <MenuLink
                                    to="/app/settings"
                                    label="Profile"
                                    onClick={closeProfileMenu}
                                />
                            </div>

                            <div className="border-t border-light-10 py-1">
                                <MenuLink
                                    to="/terms"
                                    label="Terms"
                                    onClick={closeProfileMenu}
                                />
                                <MenuLink
                                    to="/privacy"
                                    label="Privacy"
                                    onClick={closeProfileMenu}
                                />
                                <MenuLink
                                    to="/cookies"
                                    label="Cookies"
                                    onClick={closeProfileMenu}
                                />
                            </div>

                            <div className="border-t border-light-10 pt-1">
                                <button
                                    type="button"
                                    role="menuitem"
                                    disabled={isLoggingOut}
                                    onClick={() => {
                                        closeProfileMenu();
                                        logout();
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {isLoggingOut ? "Logging out..." : "Log out"}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

interface MenuLinkProps {
    to: string;
    label: string;
    onClick: () => void;
}

const MenuLink = ({ to, label, onClick }: MenuLinkProps) => (
    <Link
        to={to}
        role="menuitem"
        onClick={onClick}
        className="flex items-center rounded-lg px-3 py-2 text-sm text-light-75 transition-colors hover:bg-light-5 hover:text-light"
    >
        {label}
    </Link>
);
