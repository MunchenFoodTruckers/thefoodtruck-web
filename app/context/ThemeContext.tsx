'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'morning' | 'day' | 'evening';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('day');

    useEffect(() => {
        // Initial time check
        const updateThemeByTime = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 11) {
                setTheme('morning');
            } else if (hour >= 11 && hour < 17) {
                setTheme('day');
            } else {
                setTheme('evening');
            }
        };

        updateThemeByTime();

        // Update every minute
        const interval = setInterval(updateThemeByTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update body class
        document.body.className = ''; // Clear existing
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);

    const isDark = theme === 'evening';

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
