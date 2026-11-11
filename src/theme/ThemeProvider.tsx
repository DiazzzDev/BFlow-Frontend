import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export const THEME_STORAGE_KEY = "bflow-theme";

export type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light";

export const getStoredTheme = (): Theme => {
    if (typeof window === "undefined") {
        return "dark";
    }

    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(storedTheme) ? storedTheme : "dark";
    } catch {
        return "dark";
    }
};

export const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
};

export const initializeTheme = () => {
    if (typeof window !== "undefined") {
        applyTheme(getStoredTheme());
    }
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setThemeState] = useState<Theme>(getStoredTheme);

    const setTheme = useCallback((nextTheme: Theme) => {
        setThemeState(nextTheme);
        applyTheme(nextTheme);

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
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
        const syncThemeAcrossTabs = (event: StorageEvent) => {
            if (event.key && event.key !== THEME_STORAGE_KEY) {
                return;
            }

            const nextTheme = isTheme(event.newValue) ? event.newValue : "dark";
            setThemeState(nextTheme);
            applyTheme(nextTheme);
        };

        window.addEventListener("storage", syncThemeAcrossTabs);
        return () => window.removeEventListener("storage", syncThemeAcrossTabs);
    }, []);

    const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
