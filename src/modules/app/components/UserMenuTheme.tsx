import { Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/theme/ThemeProvider";

export const UserMenuTheme = () => {
    const { t } = useTranslation();
    const { preference, setTheme } = useTheme();

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-light">
            <span className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-helper" />
                {t("theme.title")}
            </span>

            <label className="sr-only" htmlFor="theme-preference">
                {t("theme.title")}
            </label>
            <select
                id="theme-preference"
                value={preference}
                onChange={(event) => setTheme(event.target.value as "light" | "dark" | "system")}
                className="cursor-pointer rounded-md border border-light-10 bg-surface-hard px-2 py-1 text-xs font-medium text-light outline-none transition-colors hover:border-light-25 focus-visible:ring-2 focus-visible:ring-primary"
            >
                <option value="system">{t("theme.system")}</option>
                <option value="light">{t("theme.light")}</option>
                <option value="dark">{t("theme.dark")}</option>
            </select>
        </div>
    );
};
