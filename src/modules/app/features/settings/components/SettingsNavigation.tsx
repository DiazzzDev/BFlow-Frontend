import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export type SettingsSection =
    | "account"
    | "preferences"
    | "categories"
    | "connectors"
    | "subscription";

interface SettingsNavigationProps {
    activeSection: SettingsSection;
    onSectionChange: (section: SettingsSection) => void;
}

const navigationItems = [
    { id: "account", labelKey: "settings.navigation.account" },
    { id: "preferences", labelKey: "settings.navigation.preferences" },
    { id: "categories", labelKey: "settings.navigation.categories" },
    { id: "connectors", labelKey: "settings.navigation.connectors" },
    { id: "subscription", labelKey: "settings.navigation.subscription" },
] as const satisfies ReadonlyArray<{ id: SettingsSection; labelKey: string }>;

export const SettingsNavigation = ({
    activeSection,
    onSectionChange,
}: SettingsNavigationProps) => {
    const { t } = useTranslation();

    return (
        <nav
            aria-label={t("settings.navigation.label")}
            className="flex flex-col gap-1 lg:sticky lg:top-5 lg:self-start"
        >
            {navigationItems.map(({ id, labelKey }) => {
                const isActive = activeSection === id;

                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onSectionChange(id)}
                        className={`relative flex shrink-0 items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full ${isActive
                            ? "text-light"
                            : "text-helper hover:bg-light-5 hover:text-light"
                            }`}
                    >
                        {isActive ? <motion.span layoutId="settings-active-section" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl border border-light-10 bg-linear-to-b from-[var(--settings-navigation-active-top)] to-[var(--settings-navigation-active-bottom)] shadow-[0_5px_14px_rgb(0_0_0_/_0.18),inset_0_1px_0_rgb(255_255_255_/_0.035)]" /> : null}
                        <span className="relative">{t(labelKey)}</span>
                    </button>
                );
            })}
        </nav>
    );
};
