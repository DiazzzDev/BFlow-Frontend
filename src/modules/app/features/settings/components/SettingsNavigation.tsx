import { useTranslation } from "react-i18next";

export type SettingsSection =
    | "account"
    | "preferences"
    | "categories"
    | "connectors"
    | "subscription"
    | "legal"
    | "documentation";

interface SettingsNavigationProps {
    activeSection: SettingsSection;
    onSectionChange: (section: SettingsSection) => void;
}

interface NavigationItem {
    id: SettingsSection;
    labelKey: string;
}

const navigationItems: NavigationItem[] = [
    { id: "account", labelKey: "settings.navigation.account" },
    { id: "preferences", labelKey: "settings.navigation.preferences" },
    { id: "categories", labelKey: "settings.navigation.categories" },
    { id: "connectors", labelKey: "settings.navigation.connectors" },
    { id: "subscription", labelKey: "settings.navigation.subscription" },
    { id: "legal", labelKey: "settings.navigation.legal" },
    { id: "documentation", labelKey: "settings.navigation.documentation" },
];

export const SettingsNavigation = ({
    activeSection,
    onSectionChange,
}: SettingsNavigationProps) => {
    const { t } = useTranslation();

    return (
        <nav
            aria-label={t("settings.navigation.label")}
            className="flex gap-1 overflow-x-auto pb-1 lg:sticky lg:top-5 lg:self-start lg:flex-col lg:overflow-visible"
        >
            {navigationItems.map(({ id, labelKey }) => {
                const isActive = activeSection === id;

                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onSectionChange(id)}
                        className={`relative flex shrink-0 items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition-[background,border-color,box-shadow,color] lg:w-full ${isActive
                            ? "border border-light-10 bg-linear-to-b from-[var(--settings-navigation-active-top)] to-[var(--settings-navigation-active-bottom)] text-light shadow-[0_5px_14px_rgb(0_0_0_/_0.18),inset_0_1px_0_rgb(255_255_255_/_0.035)]"
                            : "text-helper hover:bg-light-5 hover:text-light"
                            }`}
                    >
                        {isActive ? (
                            <span className="absolute left-1.5 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full bg-primary" />
                        ) : null}
                        {t(labelKey)}
                    </button>
                );
            })}
        </nav>
    );
};
