import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogOut,
  Calendar,
  BarChart3,
  LayoutGrid,
  Sparkles,
  Search,
  Target,
  Palette,
  Check,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { DoctorDoomIcon } from './CustomIcons';

export default function Navbar({
  selectedYear,
  onYearChange,
  activeTab,
  onTabChange,
  onOpenToday,
  onOpenSearch,
  onOpenBudget,
  onOpenProfile,
  onReplayIntro
}) {
  const { user, logoutUser } = useAuth();
  const { theme, setTheme, themeMode, toggleThemeMode, themes } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);

  // Close theme menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' or 'Ctrl+K' to open search
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        onOpenSearch();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // Generate years from 2000 to 2100
  const years = [];
  for (let y = 2000; y <= 2100; y++) {
    years.push(y);
  }

  // Initials for avatar
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email[0].toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/[0.08] backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: YouTube-style Brand & Year Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={onReplayIntro}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="DTD Act - Click to replay Doom intro"
          >
            {/* DTD App Logo */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm border border-black/10 dark:border-white/15 bg-white dark:bg-surface-950 transition-transform group-hover:scale-105 duration-200 flex-shrink-0">
              <img
                src="/dtd-logo.png"
                alt="DTD Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-display font-black tracking-tighter leading-none">
                DTD
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Tracker
              </span>
            </div>
          </div>

          {/* Custom Year Dropdown Pill */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="appearance-none yt-pill font-mono font-bold text-xs pl-3 pr-7 py-1 rounded-full cursor-pointer focus:outline-none shadow-sm"
              title="Select Year (2000-2100)"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center: YouTube-Style Search Bar Pill */}
        <div className="flex-1 max-w-md mx-1 sm:mx-3">
          <div
            onClick={onOpenSearch}
            className="yt-search-pill px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer flex items-center justify-between text-xs sm:text-sm group"
            title="Search expenses & meals (Press /)"
          >
            <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors min-w-0">
              <Search className="w-4 h-4 shrink-0" />
              <span className="truncate text-slate-400 font-normal">
                Search spending, meals, notes...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Mode Toggle, Log Today, Theme, Profile & Logout */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. YouTube Light / Dark Mode Toggle */}
          <button
            onClick={toggleThemeMode}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
            title={
              themeMode === 'light'
                ? 'Switch to YouTube Dark Mode'
                : 'Switch to YouTube Clean Light Mode'
            }
          >
            {themeMode === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* 2. Theme Palette Switcher Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
              title="Change Accent Color"
              style={
                themeMenuOpen
                  ? { color: 'var(--theme-accent)', backgroundColor: 'rgba(var(--theme-accent-rgb), 0.12)' }
                  : {}
              }
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeMenuOpen && (
              <div className="fixed inset-x-3.5 top-16 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:inset-x-auto sm:mt-2 sm:w-80 theme-dropdown-popover rounded-2xl overflow-hidden max-h-[calc(100vh-85px)] flex flex-col z-[100] shadow-2xl">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <Palette className="w-3.5 h-3.5 text-theme" />
                    Color Palette
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{themes.length} themes</span>
                </div>

                {/* 2-column theme grid */}
                <div className="p-2.5 grid grid-cols-2 gap-1.5 overflow-y-auto flex-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all text-left group ${
                        theme === t.id
                          ? 'bg-black/10 dark:bg-white/15 font-bold border border-black/15 dark:border-white/30 shadow-sm'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {/* Color dot */}
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 shadow-sm border border-black/20 ${t.dot}`}
                        style={{ boxShadow: `0 0 8px 1px ${t.color}66` }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block truncate">
                          {t.name}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">{t.label}</span>
                      </div>
                      {theme === t.id && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: t.color }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-black/5 dark:border-white/10 text-[10px] text-slate-400 text-center font-medium shrink-0">
                  Theme saved automatically ✓
                </div>
              </div>
            )}
          </div>

          {/* 3. Monthly Budget Target Button */}
          <button
            onClick={onOpenBudget}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
            title="Set Monthly Budget Target"
          >
            <Target className="w-4 h-4" />
          </button>

          {/* 4. YouTube Red "Log Today" Pill Button */}
          <button
            onClick={onOpenToday}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs btn-youtube-red active:scale-95 transition-all"
            title="Log Today's Spending"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>+ Today</span>
          </button>

          {/* 5. User Profile Circular Button */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30 flex items-center justify-center text-xs font-black font-display hover:scale-105 active:scale-95 transition-all"
            title="View User Profile"
          >
            {initials}
          </button>

          {/* 6. Logout Button */}
          <button
            onClick={logoutUser}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
