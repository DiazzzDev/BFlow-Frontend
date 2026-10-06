import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useChangeLanguage } from "../hooks/useChangeLanguage";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/i18n/types";

export const UserMenuLanguage = () => {
    const { t } = useTranslation();
    const { activeLanguage, changeLanguage, isPending } = useChangeLanguage();

    return (
        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-light">
            <span className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-helper" />
                {t("language.title")}
            </span>

            <div
                role="group"
                aria-label={t("language.label")}
                className="flex rounded-lg border border-light-10 bg-surface-hard p-0.5"
            >
                {SUPPORTED_LANGUAGES.map((language) => {
                    const isActive = language === activeLanguage;

                    return (
                        <button
                            key={language}
                            type="button"
                            disabled={isPending}
                            aria-pressed={isActive}
                            aria-label={LANGUAGE_LABELS[language]}
                            title={LANGUAGE_LABELS[language]}
                            onClick={() => void changeLanguage(language)}
                            className={`cursor-pointer rounded-md px-2 py-0.5 text-xs font-semibold uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-primary text-light" : "text-helper hover:text-light"
                                }`}
                        >
                            {language}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
