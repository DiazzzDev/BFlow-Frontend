import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import {
    DEFAULT_LANGUAGE,
    getBrowserLanguage,
    normalizeLanguage,
    type LanguageCode,
} from "./types";

const LANGUAGE_STORAGE_KEY = "bflow-language";

const getStoredLanguage = (): LanguageCode | null => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    } catch {
        return null;
    }
};

export const getInitialLanguage = (): LanguageCode =>
    getStoredLanguage() ?? getBrowserLanguage();

void i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        es: { translation: es },
    },
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ["en", "es"],
    load: "languageOnly",
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export const getActiveLanguage = (): LanguageCode =>
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? DEFAULT_LANGUAGE;

export const setActiveLanguage = (language: unknown): LanguageCode => {
    const normalized = normalizeLanguage(language) ?? getBrowserLanguage();

    void i18n.changeLanguage(normalized);

    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch {
        // Storage can be unavailable in private browsing or embedded contexts.
    }

    return normalized;
};

export default i18n;
