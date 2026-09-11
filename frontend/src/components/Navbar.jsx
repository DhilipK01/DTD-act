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
  User
} from 'lucide-react';

export default function Navbar({
  selectedYear,
  onYearChange,
  activeTab,
  onTabChange,
  onOpenToday,
  onOpenSearch,
  onOpenBudget,
  onOpenProfile
}) {
  const { user, logoutUser } = useAuth();
  const { theme, setTheme, themes } = useTheme();
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
    <header className="sticky top-0 z-30 glass-panel border-b border-white/[0.08] backdrop-blur-2xl bg-dark-900/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Year Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-glow transition-transform group-hover:scale-105 duration-200">
              ₹
            </div>
            <div>
              <span className="text-lg font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
                DailyExpense
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-400 tracking-wide">
                Personal Tracker
              </span>
            </div>
          </div>

          {/* Custom Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono font-bold text-xs pl-3 pr-8 py-1.5 rounded-xl border border-white/10 hover:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer shadow-sm"
              title="Select Year (2000-2100)"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white font-sans">
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Hidden on mobile since bottom bar exists, visible on tablet/desktop) */}
        <nav className="hidden sm:flex items-center bg-black/40 p-1 rounded-2xl border border-white/[0.08] sm:order-2 w-auto justify-around backdrop-blur-md">
          <button
            onClick={() => onTabChange('yearGrid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'yearGrid'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-glow font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Months</span>
          </button>

          <button
            onClick={() => onTabChange('monthView')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'monthView'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-glow font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-glow font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Actions: Theme Switcher, Search, Budget, Today Log, Profile & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Palette Switcher Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all"
              title="Change Aesthetic Color Theme"
              style={themeMenuOpen ? { color: 'var(--theme-accent)', borderColor: 'rgba(var(--theme-accent-rgb), 0.4)' } : {}}
            >
              <Palette className="w-4 h-4" />
            </button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-950/98 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
                    Choose Your Theme
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{themes.length} themes</span>
                </div>

                {/* 2-column theme grid */}
                <div className="p-2 grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all text-left group ${
                        theme === t.id
                          ? 'bg-white/[0.10] font-bold border border-white/20'
                          : 'hover:bg-white/[0.05] border border-transparent hover:border-white/10'
                      }`}
                    >
                      {/* Color dot */}
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 shadow-md border-2 border-black/30 ${t.dot}`}
                        style={theme === t.id ? { boxShadow: `0 0 8px 2px ${t.color}66` } : {}}
                      />
                      <div className="min-w-0">
                        <span className={`text-[11px] font-bold block truncate ${
                          theme === t.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {t.name}
                        </span>
                        <span className="text-[9px] text-slate-500 block">{t.label}</span>
                      </div>
                      {theme === t.id && (
                        <Check className="w-3 h-3 ml-auto shrink-0" style={{ color: t.color }} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2.5 border-t border-white/10 text-[10px] text-slate-500 text-center">
                  Theme saved automatically ✓
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-xl border border-white/10 transition-all"
            title="Search expenses & meals"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Monthly Budget Target */}
          <button
            onClick={onOpenBudget}
            className="p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 rounded-xl border border-white/10 transition-all"
            title="Set Monthly Budget Target"
          >
            <Target className="w-4 h-4" />
          </button>

          {/* Quick "Log Today" with glowing border */}
          <button
            onClick={onOpenToday}
            className="relative group flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 rounded-xl transition-all shadow-glow hover:brightness-110 active:scale-95"
            title="Log Today's Spending"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Log Today</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer group"
            title="View User Profile (Read-Only)"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[11px] font-black text-emerald-400 font-display">
              {initials}
            </div>
            <span
              className="text-xs font-bold text-slate-300 group-hover:text-white hidden md:inline-block max-w-[120px] truncate"
            >
              {user?.fullName || user?.email?.split('@')[0]}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
