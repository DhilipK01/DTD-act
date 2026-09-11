import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { formatDateStr } from './utils/dateHelpers';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import YearPickerGrid from './components/YearPickerGrid';
import MonthCalendarView from './components/MonthCalendarView';
import DayEntrySheet from './components/DayEntrySheet';
import MonthlySummary from './components/MonthlySummary';
import YearlySummary from './components/YearlySummary';
import SearchModal from './components/SearchModal';
import BudgetModal from './components/BudgetModal';
import { DoctorDoomIcon } from './components/CustomIcons';
import { LayoutGrid, Calendar, BarChart3, Plus, Sparkles, User } from 'lucide-react';

export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [activeTab, setActiveTab] = useState('monthView'); // 'yearGrid' | 'monthView' | 'analytics'
  const [analyticsSubTab, setAnalyticsSubTab] = useState('monthly'); // 'monthly' | 'yearly'
  
  const [editingDate, setEditingDate] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [yearData, setYearData] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Doctor Doom 5-second splash screen on app boot
  const [showDoomSplash, setShowDoomSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDoomSplash(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Load analytics for current year and month
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const [yRes, mRes] = await Promise.all([
        api.getYearSummary(selectedYear),
        api.getMonthSummary(selectedYear, selectedMonth)
      ]);
      setYearData(yRes);
      setMonthData(mRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [isAuthenticated, selectedYear, selectedMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Selecting a month from Year Grid opens that month in Month View
  const handleSelectMonth = (m) => {
    setSelectedMonth(m);
    setActiveTab('monthView');
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => Math.max(2000, y - 1));
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => Math.min(2100, y + 1));
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleOpenToday = () => {
    const now = new Date();
    const todayStr = formatDateStr(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
    setEditingDate(todayStr);
  };

  // 5-second Doctor Doom splash screen on boot
  if (showDoomSplash || authLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05070d] text-slate-200 p-4 select-none overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.22)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex flex-col items-center gap-6 text-center max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-500">
          {/* Doctor Doom Real Image Frame */}
          <div className="relative group">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_0_50px_-5px_rgba(16,185,129,0.6)] bg-black">
              <img
                src="/doom.png"
                alt="Doctor Doom"
                className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
              />
            </div>
            {/* Ambient pulse halo */}
            <div className="absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-40 blur-lg -z-10 animate-pulse" />
          </div>

          {/* Doom Dialogue */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-display font-black tracking-wide text-emerald-400 drop-shadow-[0_0_16px_rgba(16,185,129,0.6)] uppercase px-2 leading-snug">
              "Fear is for lesser men...... Never for DOOM!"
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                DTD • Latveria Protocol
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, display the passwordless / password Auth modal
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent pb-24 sm:pb-10 bg-ambient-dots">
      {/* Top Sticky Header */}
      <Navbar
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenToday={handleOpenToday}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBudget={() => setIsBudgetOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-7">
        {/* Tab 1: 12-Month Overview Grid */}
        {activeTab === 'yearGrid' && (
          <YearPickerGrid
            year={selectedYear}
            yearData={yearData}
            onSelectMonth={handleSelectMonth}
          />
        )}

        {/* Tab 2: Selected Month View (Calendar Grid & Day List) */}
        {activeTab === 'monthView' && (
          <MonthCalendarView
            year={selectedYear}
            month={selectedMonth}
            monthData={monthData}
            onSelectDate={(dateStr) => setEditingDate(dateStr)}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onBackToMonths={() => setActiveTab('yearGrid')}
            onOpenBudget={() => setIsBudgetOpen(true)}
          />
        )}

        {/* Tab 3: Analytics (Monthly & Yearly Breakdown) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Sub-navigation for Analytics */}
            <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-2xl border border-white/10 max-w-xs mx-auto backdrop-blur-xl">
              <button
                onClick={() => setAnalyticsSubTab('monthly')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  analyticsSubTab === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Monthly Summary
              </button>
              <button
                onClick={() => setAnalyticsSubTab('yearly')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  analyticsSubTab === 'yearly'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Yearly Summary
              </button>
            </div>

            {analyticsSubTab === 'monthly' ? (
              <MonthlySummary
                year={selectedYear}
                month={selectedMonth}
                monthData={monthData}
                onSelectDate={(dateStr) => setEditingDate(dateStr)}
                onOpenBudgetModal={() => setIsBudgetOpen(true)}
              />
            ) : (
              <YearlySummary
                year={selectedYear}
                yearData={yearData}
                onSelectMonth={handleSelectMonth}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Rapid Logging on Mobile */}
      <div className="fixed bottom-20 right-4 sm:hidden z-20">
        <button
          onClick={handleOpenToday}
          className="w-14 h-14 rounded-2xl btn-theme-primary flex items-center justify-center shadow-theme-glow active:scale-95 transition-all"
          title="Log Today's Spending"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar with Safe Area Support */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-white/10 bg-black/90 backdrop-blur-2xl px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] z-30 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('yearGrid')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'yearGrid' ? 'text-theme-light drop-shadow-[0_0_8px_var(--theme-glow)]' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Months</span>
        </button>

        <button
          onClick={() => setActiveTab('monthView')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'monthView' ? 'text-theme-light drop-shadow-[0_0_8px_var(--theme-glow)]' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'analytics' ? 'text-theme-light drop-shadow-[0_0_8px_var(--theme-glow)]' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold transition-colors text-slate-400 hover:text-theme-light"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {/* Day Entry Modal / Sheet */}
      {editingDate && (
        <DayEntrySheet
          date={editingDate}
          onClose={() => setEditingDate(null)}
          onSaved={() => {
            loadData();
          }}
        />
      )}

      {/* Search & History Modal */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onSelectDate={(dateStr) => setEditingDate(dateStr)}
        />
      )}

      {/* Monthly Budget Modal */}
      {isBudgetOpen && (
        <BudgetModal
          year={selectedYear}
          month={selectedMonth}
          currentBudget={monthData?.budget?.amount || 0}
          onClose={() => setIsBudgetOpen(false)}
          onBudgetUpdated={() => {
            loadData();
          }}
        />
      )}

      {/* Read-Only Profile Page / Modal */}
      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
