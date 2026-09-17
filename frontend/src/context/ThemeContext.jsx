import React, { createContext, useContext, useState, useEffect } from 'react';

const THEMES = [
  // 1. YouTube Red — signature primary YouTube theme
  {
    id: 'youtube',
    name: 'YouTube Red',
    color: '#ff0000',
    dot: 'bg-red-600',
    label: '▶ YouTube Red'
  },
  // 2. Neon Emerald — classic emerald
  {
    id: 'emerald',
    name: 'Neon Emerald',
    color: '#10b981',
    dot: 'bg-emerald-400',
    label: '🟢 Emerald'
  },
  // 3. Electric Purple — vivid violet
  {
    id: 'violet',
    name: 'Electric Violet',
    color: '#8b5cf6',
    dot: 'bg-violet-400',
    label: '🟣 Purple'
  },
  // 4. Crimson Red — bold crimson
  {
    id: 'crimson',
    name: 'Crimson Blaze',
    color: '#ef4444',
    dot: 'bg-red-400',
    label: '🔴 Crimson'
  },
  // 5. Cyber Pink — neon pink magenta
  {
    id: 'pink',
    name: 'Cyber Pink',
    color: '#ec4899',
    dot: 'bg-pink-400',
    label: '🩷 Pink'
  },
  // 6. Sapphire Ocean — deep blue
  {
    id: 'ocean',
    name: 'Sapphire Ocean',
    color: '#0ea5e9',
    dot: 'bg-sky-400',
    label: '🔵 Blue'
  },
  // 7. Sunset Gold — premium amber
  {
    id: 'amber',
    name: 'Sunset Gold',
    color: '#f59e0b',
    dot: 'bg-amber-400',
    label: '🟡 Gold'
  },
  // 8. Lime Fresh — bright lime green fresh
  {
    id: 'lime',
    name: 'Lime Fresh',
    color: '#84cc16',
    dot: 'bg-lime-400',
    label: '🍏 Fresh'
  },
  // 9. Neon Orange — fiery tangerine
  {
    id: 'orange',
    name: 'Neon Orange',
    color: '#f97316',
    dot: 'bg-orange-400',
    label: '🟠 Orange'
  },
  // 10. Teal Aqua — cool teal mint
  {
    id: 'teal',
    name: 'Teal Aqua',
    color: '#14b8a6',
    dot: 'bg-teal-400',
    label: '🩵 Teal'
  },
  // 11. Rose Petal — soft rose glow
  {
    id: 'rose',
    name: 'Rose Petal',
    color: '#fb7185',
    dot: 'bg-rose-400',
    label: '🌹 Rose'
  },
  // 12. Deep Indigo — dark navy purple
  {
    id: 'indigo',
    name: 'Deep Indigo',
    color: '#6366f1',
    dot: 'bg-indigo-400',
    label: '💜 Indigo'
  },
  // 13. Cyber Yellow — electric yellow neon
  {
    id: 'yellow',
    name: 'Cyber Yellow',
    color: '#eab308',
    dot: 'bg-yellow-400',
    label: '⚡ Yellow'
  },
  // 14. Fuchsia Pulse — ultra vivid fuchsia
  {
    id: 'fuchsia',
    name: 'Fuchsia Pulse',
    color: '#d946ef',
    dot: 'bg-fuchsia-400',
    label: '🔮 Fuchsia'
  },
  // 15. Arctic Cyan — ice cold cyan
  {
    id: 'cyan',
    name: 'Arctic Cyan',
    color: '#06b6d4',
    dot: 'bg-cyan-400',
    label: '🧊 Cyan'
  },
];

const ThemeContext = createContext({
  theme: 'youtube',
  setTheme: () => {},
  themeMode: 'light',
  setThemeMode: () => {},
  toggleThemeMode: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }) {
  // Theme Mode: 'light' (YouTube Light) or 'dark' (YouTube Dark). Default: 'light'
  const [themeMode, setThemeModeState] = useState(() => {
    return localStorage.getItem('dtd_theme_mode') || 'light';
  });

  // Color theme: default 'youtube'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('daily_expense_theme') || 'youtube';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('daily_expense_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setThemeMode = (newMode) => {
    setThemeModeState(newMode);
    localStorage.setItem('dtd_theme_mode', newMode);
    document.documentElement.setAttribute('data-theme-mode', newMode);
  };

  const toggleThemeMode = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-mode', themeMode);
  }, [theme, themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        themes: THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
