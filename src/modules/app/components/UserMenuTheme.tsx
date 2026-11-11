import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme/ThemeProvider";

export const UserMenuTheme = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const isDarkTheme = theme === "dark";

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-light">
            <span className="flex items-center gap-3">
                {isDarkTheme ? <Moon className="h-4 w-4 text-helper" /> : <Sun className="h-4 w-4 text-helper" />}
                {t("theme.title")}
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={isDarkTheme}
                aria-label={t("theme.toggle", { theme: t(isDarkTheme ? "theme.light" : "theme.dark") })}
                title={t("theme.toggle", { theme: t(isDarkTheme ? "theme.light" : "theme.dark") })}
                onClick={toggleTheme}
                className="group relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-light-10 bg-surface-hard p-0.5 transition-all hover:border-light-25 active:scale-95"
            >
                <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full bg-primary text-light shadow-sm transition-transform duration-200 ${isDarkTheme ? "translate-x-5" : "translate-x-0"}`}
                >
                    {isDarkTheme ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                </span>
            </button>
        </div>
    );
};
