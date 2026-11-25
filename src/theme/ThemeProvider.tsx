import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

/* eslint-disable react-refresh/only-export-components, react/hook-use-state -- This module exposes theme helpers alongside its provider and uses React's lazy initializer. */

export const THEME_STORAGE_KEY = "bflow-theme";

export type Theme = "dark" | "light";
export type ThemePreference = Theme | "system";

interface ThemeContextValue {
    theme: Theme;
    preference: ThemePreference;
    setTheme: (theme: ThemePreference) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";
const isThemePreference = (value: unknown): value is ThemePreference => isTheme(value) || value === "system";

const getSystemTheme = (): Theme =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";

export const getStoredTheme = (): ThemePreference => {
    if (typeof window === "undefined") {
        return "system";
    }

    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isThemePreference(storedTheme) ? storedTheme : "system";
    } catch {
        return "system";
    }
};

const resolveTheme = (preference: ThemePreference): Theme =>
    preference === "system" ? getSystemTheme() : preference;

export const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
};

export const initializeTheme = () => {
    if (typeof window !== "undefined") {
        applyTheme(resolveTheme(getStoredTheme()));
    }
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [preference, setPreference] = useState<ThemePreference>(getStoredTheme);
    const [theme, setThemeState] = useState<Theme>(() => resolveTheme(getStoredTheme()));

    const setTheme = useCallback((nextPreference: ThemePreference) => {
        setPreference(nextPreference);
        setThemeState(resolveTheme(nextPreference));

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
        } catch {
            // Storage can be unavailable in private browsing or embedded contexts.
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [setTheme, theme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        if (preference !== "system") {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
        const syncSystemTheme = () => setThemeState(getSystemTheme());
        mediaQuery.addEventListener("change", syncSystemTheme);
        return () => mediaQuery.removeEventListener("change", syncSystemTheme);
    }, [preference]);

    useEffect(() => {
        const syncThemeAcrossTabs = (event: StorageEvent) => {
            if (event.key && event.key !== THEME_STORAGE_KEY) {
                return;
            }

            const nextPreference = isThemePreference(event.newValue) ? event.newValue : "system";
            setPreference(nextPreference);
            setThemeState(resolveTheme(nextPreference));
        };

        window.addEventListener("storage", syncThemeAcrossTabs);
        return () => window.removeEventListener("storage", syncThemeAcrossTabs);
    }, []);

    const value = useMemo(
        () => ({ theme, preference, setTheme, toggleTheme }),
        [preference, setTheme, theme, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
