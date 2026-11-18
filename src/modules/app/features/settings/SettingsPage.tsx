import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { DeleteAccountModal } from "./components/DeleteAccountModal";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { EditProfileModal } from "./components/EditProfileModal";
import { SettingsAccountSection } from "./components/sections/SettingsAccountSection";
import { SettingsCategoriesSection } from "./components/sections/SettingsCategoriesSection";
import { SettingsConnectorsSection } from "./components/sections/SettingsConnectorsSection";
import {
    SettingsNavigation,
    type SettingsSection,
} from "./components/SettingsNavigation";
import { SettingsPreferencesSection } from "./components/sections/SettingsPreferencesSection";
import { SettingsSubscriptionSection } from "./components/sections/SettingsSubscriptionSection";
import { SettingsLegalSection } from "./components/sections/SettingsLegalSection";
import { SettingsDocumentationSection } from "./components/sections/SettingsDocumentationSection";

import { useLogout } from "@/auth/hooks/useLogout";

export const SettingsPage = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<SettingsSection>("account");
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
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

    const sectionContent = {
        account: (
            <SettingsAccountSection
                isLoggingOut={isLoggingOut}
                onEditProfile={() => setIsProfileModalOpen(true)}
                onChangePassword={() => setIsChangePasswordModalOpen(true)}
                onLogout={() => {
                    void handleLogout();
                }}
                onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
            />
        ),
        preferences: <SettingsPreferencesSection />,
        categories: <SettingsCategoriesSection />,
        connectors: <SettingsConnectorsSection />,
        subscription: <SettingsSubscriptionSection />,
        legal: <SettingsLegalSection />,
        documentation: <SettingsDocumentationSection />,
    } satisfies Record<SettingsSection, ReactNode>;

    return (
        <div className="h-full min-h-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-270 flex-col gap-7 pb-8">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {t("settings.pageTitle")}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper sm:text-base">
                        {t("settings.pageDescription")}
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
                    <SettingsNavigation
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                    <main className="min-w-0">{sectionContent[activeSection]}</main>
                </div>

                <EditProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                />
                <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={() => setIsChangePasswordModalOpen(false)}
                />
                <DeleteAccountModal
                    isOpen={isDeleteAccountModalOpen}
                    onClose={() => setIsDeleteAccountModalOpen(false)}
                />
            </div>
        </div>
    );
};
