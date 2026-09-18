import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { FolderOpen, LogOut } from "lucide-react";

import { CategoriesModal } from "./components/CategoriesModal";
import { EditProfileModal } from "./components/EditProfileModal";
import { SettingsProfileSection } from "./components/SettingsProfileSection";
import { SettingsSectionCard } from "./components/SettingsSectionCard";
import { SettingsSubscriptionSection } from "./components/SettingsSubscriptionSection";
import { LanguageSettingsSection } from "./components/LanguageSettingsSection";


import { useLogout } from "@/auth/hooks/useLogout";
import { Button } from "@/components/controls/Button";

export const SettingsPage = () => {
    const { t } = useTranslation();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(t("settings.logoutSuccess"));
        } catch (error) {
            toast.error(t("settings.logoutError"));
            console.error("Error logout:", error);
        }
    };

    return (
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 py-5 sm:px-7">

            <div className="flex flex-col gap-4 pb-6 ">
                <SettingsProfileSection onEdit={() => setIsProfileModalOpen(true)} />

                <SettingsSubscriptionSection />

                <LanguageSettingsSection />

                <SettingsSectionCard
                    title={t("settings.categoriesTitle")}
                    description={t("settings.categoriesDescription")}
                    action={
                        <Button
                            type="button"
                            text={t("common.manage")}
                            icon={<FolderOpen className="h-4 w-4" />}
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="w-fit"
                        />
                    }
                />

                <SettingsSectionCard
                    title={t("settings.logoutTitle")}
                    description={t("settings.logoutDescription")}
                    titleClassName="text-danger"
                    action={
                        <button
                            type="button"
                            disabled={isLoggingOut}
                            onClick={() => {
                                void handleLogout();
                            }}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-danger/40 px-5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? t("settings.loggingOut") : t("settings.logout")}
                        </button>
                    }
                />
            </div>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
            <CategoriesModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
            />
        </div>
    );
};
