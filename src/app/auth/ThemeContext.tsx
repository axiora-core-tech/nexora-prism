import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const THEME_KEY = 'prism_theme';

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('prism-light');
    root.classList.remove('prism-dark');
  } else {
    root.classList.add('prism-dark');
    root.classList.remove('prism-light');
  }
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

// Default context value — safe fallback if somehow used outside provider
// (prevents the "must be within ThemeProvider" crash during HMR / Strict Mode)
const defaultContext: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply class synchronously on mount and on every change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);               // apply immediately — don't wait for effect
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);          // apply immediately
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// No longer throws — returns the default dark context as a safe fallback
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
