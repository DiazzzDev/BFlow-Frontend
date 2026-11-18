import { LogOut, Pencil, Trash2, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SettingsContentCard } from "./SettingsContentCard";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { getInitials } from "@/utils/getInitials";

interface SettingsAccountSectionProps {
    isLoggingOut: boolean;
    onEditProfile: () => void;
    onChangePassword: () => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
}

export const SettingsAccountSection = ({
    isLoggingOut,
    onEditProfile,
    onChangePassword,
    onLogout,
    onDeleteAccount,
}: SettingsAccountSectionProps) => {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const displayName = user?.name?.trim() || t("settings.profile");

    return (
        <SettingsContentCard title={t("settings.account.title")}>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-3 text-sm text-helper">{t("settings.account.profileLabel")}</p>
                        <div className="flex min-w-0 items-center gap-3">
                            {user?.pictureUrl ? (
                                <img
                                    src={user.pictureUrl}
                                    alt={displayName}
                                    className="h-12 w-12 shrink-0 rounded-full border border-light-10 object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/60 bg-primary-10 text-sm font-semibold text-primary">
                                    {user?.name ? getInitials(user.name) : <UserRound className="h-5 w-5" />}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-light">{displayName}</p>
                                {user?.email ? <p className="truncate text-sm text-helper">{user.email}</p> : null}
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        text={t("settings.editProfile")}
                        icon={<Pencil className="h-4 w-4" />}
                        onClick={onEditProfile}
                        className="w-full sm:w-auto"
                    />
                </div>

                <div className="border-t border-light-10" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-light">{t("settings.logoutTitle")}</h3>
                        <p className="mt-1 text-sm text-helper">{t("settings.logoutDescription")}</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        text={isLoggingOut ? t("settings.loggingOut") : t("settings.logout")}
                        icon={<LogOut className="h-4 w-4" />}
                        disabled={isLoggingOut}
                        onClick={onLogout}
                        className="w-full sm:w-auto"
                    />
                </div>

                <div>
                    <p className="mb-1 text-sm text-helper">{t("settings.account.security")}</p>
                    <div className="divide-y divide-light-10">
                        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.account.passwordTitle")}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.account.passwordDescription")}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                text={t("settings.account.changePassword")}
                                onClick={onChangePassword}
                                className="w-full sm:w-auto"
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.account.twoFactorTitle")}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.account.twoFactorDescription")}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-light-5 px-2.5 py-1 text-xs font-medium text-helper">
                                    {t("settings.account.disabled")}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    text={t("settings.account.enable")}
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-danger/40 bg-danger/5 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-3">
                            <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                            <div>
                                <h3 className="text-sm font-semibold text-danger">{t("settings.deleteAccountTitle")}</h3>
                                <p className="mt-1 text-sm text-helper">{t("settings.account.deleteHint")}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            text={t("settings.deleteAccount")}
                            onClick={onDeleteAccount}
                            className="w-full border-danger/50 text-danger hover:bg-danger/10 sm:w-auto"
                        />
                    </div>
                </div>
            </div>
        </SettingsContentCard>
    );
};
