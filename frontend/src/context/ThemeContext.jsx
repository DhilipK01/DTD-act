import React, { createContext, useContext, useState, useEffect } from 'react';

const THEMES = [
  { id: 'emerald', name: 'Emerald Aurora', color: '#10b981', dot: 'bg-emerald-400' },
  { id: 'violet', name: 'Cyber Neon', color: '#8b5cf6', dot: 'bg-purple-400' },
  { id: 'ocean', name: 'Sapphire Ocean', color: '#0ea5e9', dot: 'bg-sky-400' },
  { id: 'amber', name: 'Sunset Gold', color: '#f59e0b', dot: 'bg-amber-400' },
];

const ThemeContext = createContext({
  theme: 'emerald',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('daily_expense_theme') || 'emerald';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('daily_expense_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
