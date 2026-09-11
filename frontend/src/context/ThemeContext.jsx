import React, { createContext, useContext, useState, useEffect } from 'react';

const THEMES = [
  // 1. Neon Green — current default
  {
    id: 'emerald',
    name: 'Neon Emerald',
    color: '#10b981',
    dot: 'bg-emerald-400',
    label: '🟢 Classic'
  },
  // 2. Electric Purple — vivid violet neon
  {
    id: 'violet',
    name: 'Electric Violet',
    color: '#8b5cf6',
    dot: 'bg-violet-400',
    label: '🟣 Purple'
  },
  // 3. Crimson Red — bold red-rose premium
  {
    id: 'crimson',
    name: 'Crimson Blaze',
    color: '#ef4444',
    dot: 'bg-red-400',
    label: '🔴 Red'
  },
  // 4. Cyber Pink — neon pink magenta
  {
    id: 'pink',
    name: 'Cyber Pink',
    color: '#ec4899',
    dot: 'bg-pink-400',
    label: '🩷 Pink'
  },
  // 5. Sapphire Ocean — deep blue
  {
    id: 'ocean',
    name: 'Sapphire Ocean',
    color: '#0ea5e9',
    dot: 'bg-sky-400',
    label: '🔵 Blue'
  },
  // 6. Sunset Gold — premium amber
  {
    id: 'amber',
    name: 'Sunset Gold',
    color: '#f59e0b',
    dot: 'bg-amber-400',
    label: '🟡 Gold'
  },
  // 7. Lime Fresh — bright lime green fresh
  {
    id: 'lime',
    name: 'Lime Fresh',
    color: '#84cc16',
    dot: 'bg-lime-400',
    label: '🍏 Fresh'
  },
  // 8. Neon Orange — fiery tangerine
  {
    id: 'orange',
    name: 'Neon Orange',
    color: '#f97316',
    dot: 'bg-orange-400',
    label: '🟠 Orange'
  },
  // 9. Teal Aqua — cool teal mint
  {
    id: 'teal',
    name: 'Teal Aqua',
    color: '#14b8a6',
    dot: 'bg-teal-400',
    label: '🩵 Teal'
  },
  // 10. Rose Petal — soft rose glow
  {
    id: 'rose',
    name: 'Rose Petal',
    color: '#fb7185',
    dot: 'bg-rose-400',
    label: '🌹 Rose'
  },
  // 11. Deep Indigo — dark navy purple
  {
    id: 'indigo',
    name: 'Deep Indigo',
    color: '#6366f1',
    dot: 'bg-indigo-400',
    label: '💜 Indigo'
  },
  // 12. Cyber Yellow — electric yellow neon
  {
    id: 'yellow',
    name: 'Cyber Yellow',
    color: '#eab308',
    dot: 'bg-yellow-400',
    label: '⚡ Yellow'
  },
  // 13. Fuchsia Pulse — ultra vivid fuchsia
  {
    id: 'fuchsia',
    name: 'Fuchsia Pulse',
    color: '#d946ef',
    dot: 'bg-fuchsia-400',
    label: '🔮 Fuchsia'
  },
  // 14. Arctic Cyan — ice cold cyan
  {
    id: 'cyan',
    name: 'Arctic Cyan',
    color: '#06b6d4',
    dot: 'bg-cyan-400',
    label: '🧊 Cyan'
  },
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
