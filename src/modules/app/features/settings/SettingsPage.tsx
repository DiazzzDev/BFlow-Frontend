import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { DeleteAccountModal } from "./components/DeleteAccountModal";
import { CancelSubscriptionModal } from "./components/CancelSubscriptionModal";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { EditProfileModal } from "./components/EditProfileModal";
import { MfaSetupPage } from "./components/MfaSetupPage";
import { SettingsAccountSection } from "./components/sections/SettingsAccountSection";
import { SettingsCategoriesSection } from "./components/sections/SettingsCategoriesSection";
import { SettingsConnectorsSection } from "./components/sections/SettingsConnectorsSection";
import {
    SettingsNavigation,
    type SettingsSection,
} from "./components/SettingsNavigation";
import { SettingsPreferencesSection } from "./components/sections/SettingsPreferencesSection";
import { SettingsSubscriptionSection } from "./components/sections/SettingsSubscriptionSection";
import { SettingsFooter } from "./components/SettingsFooter";

import { useLogout } from "@/auth/hooks/useLogout";
import { authService } from "@/auth/services/authService";

export const SettingsPage = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<SettingsSection>("account");
    const [isMobileSectionOpen, setIsMobileSectionOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] = useState(false);
    const [isMfaSetupOpen, setIsMfaSetupOpen] = useState(false);
    const [canChangePassword, setCanChangePassword] = useState(false);
    const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

    useEffect(() => {
        void authService.canChangePassword().then(setCanChangePassword).catch(() => setCanChangePassword(false));
    }, []);

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
                canChangePassword={canChangePassword}
                onEnableMfa={() => setIsMfaSetupOpen(true)}
                onLogout={() => {
                    void handleLogout();
                }}
                onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
            />
        ),
        preferences: <SettingsPreferencesSection />,
        categories: <SettingsCategoriesSection />,
        connectors: <SettingsConnectorsSection />,
        subscription: (
            <SettingsSubscriptionSection
                onCancelSubscription={() => setIsCancelSubscriptionModalOpen(true)}
            />
        ),
    } satisfies Record<SettingsSection, ReactNode>;

    if (isMfaSetupOpen) {
        return (
            <MfaSetupPage
                onBack={() => setIsMfaSetupOpen(false)}
                onComplete={() => setIsMfaSetupOpen(false)}
            />
        );
    }

    return (
        <div className="h-full min-h-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-270 flex-col gap-7 pb-8">
                <header className={isMobileSectionOpen ? "hidden lg:block" : ""}>
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {t("settings.pageTitle")}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper sm:text-base">
                        {t("settings.pageDescription")}
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
                    <div className={isMobileSectionOpen ? "hidden lg:block" : "block"}>
                        <SettingsNavigation
                            activeSection={activeSection}
                            onSectionChange={(section) => {
                                setActiveSection(section);
                                setIsMobileSectionOpen(true);
                            }}
                        />
                    </div>
                    <main className={`min-w-0 ${isMobileSectionOpen ? "block" : "hidden lg:block"}`}>
                        <div className="mb-5 flex items-center gap-3 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setIsMobileSectionOpen(false)}
                                aria-label={t("settings.navigation.back")}
                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-helper transition-colors hover:bg-light-5 hover:text-light"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <h2 className="text-xl font-semibold tracking-tight text-light">
                                {t(`settings.navigation.${activeSection}`)}
                            </h2>
                        </div>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                {sectionContent[activeSection]}
                            </motion.div>
                        </AnimatePresence>
                    </main>
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
                <CancelSubscriptionModal
                    isOpen={isCancelSubscriptionModalOpen}
                    onClose={() => setIsCancelSubscriptionModalOpen(false)}
                />
                <SettingsFooter />
            </div>
        </div>
    );
};
