export const SUPPORTED_LANGUAGES = ["es", "en"] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
    es: "Español",
    en: "English",
};

export const normalizeLanguage = (value: unknown): LanguageCode | null => {
    if (typeof value !== "string") {
        return null;
    }

    const language = value.trim().toLowerCase().replace("_", "-");

    if (language.startsWith("es")) {
        return "es";
    }

    if (language.startsWith("en")) {
        return "en";
    }

    return null;
};

export const getBrowserLanguage = (): LanguageCode => {
    if (typeof navigator === "undefined") {
        return DEFAULT_LANGUAGE;
    }

    const browserLanguages = navigator.languages.length
        ? navigator.languages
        : [navigator.language];

    for (const language of browserLanguages) {
        const normalized = normalizeLanguage(language);

        if (normalized) {
            return normalized;
        }
    }

    return DEFAULT_LANGUAGE;
};
