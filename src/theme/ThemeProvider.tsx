import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "ocean" | "purple" | "grass";

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => { //load current saved theme
        if (typeof window === "undefined") return "dark";
        const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
        return saved ?? "dark";
    });

    // apply theme to DOM
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);

    const toggleTheme = () =>
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}