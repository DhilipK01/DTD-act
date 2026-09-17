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
import DoomIntro from './components/DoomIntro';
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

  // Doctor Doom cinematic intro on app boot & replayable
  const [showDoomIntro, setShowDoomIntro] = useState(true);


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

  // Doctor Doom cinematic intro
  if (showDoomIntro) {
    return <DoomIntro onComplete={() => setShowDoomIntro(false)} />;
  }

  // If loading auth state after intro
  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-950 text-slate-900 dark:text-slate-200">
        <div className="w-12 h-12 rounded-full border-2 border-t-red-600 border-black/10 dark:border-white/10 animate-spin mb-5" />
        <p className="text-xs font-mono font-bold tracking-widest uppercase text-red-600 dark:text-red-400">
          Initializing DTD Dashboard...
        </p>
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
        onReplayIntro={() => setShowDoomIntro(true)}
      />

      {/* YouTube-Style Category Filter Chips Row (Sticky below Navbar) */}
      <div className="sticky top-[57px] sm:top-[61px] z-20 bg-yt-bg/95 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] py-2 px-3.5 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('monthView')}
            className={`yt-pill ${
              activeTab === 'monthView' ? 'yt-pill-active' : ''
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('yearGrid')}
            className={`yt-pill ${
              activeTab === 'yearGrid' ? 'yt-pill-active' : ''
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Months</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              setAnalyticsSubTab('monthly');
            }}
            className={`yt-pill ${
              activeTab === 'analytics' && analyticsSubTab === 'monthly' ? 'yt-pill-active' : ''
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Monthly Summary</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              setAnalyticsSubTab('yearly');
            }}
            className={`yt-pill ${
              activeTab === 'analytics' && analyticsSubTab === 'yearly' ? 'yt-pill-active' : ''
            }`}
          >
            <span>Yearly Breakdown</span>
          </button>

          <div className="w-px h-5 bg-black/10 dark:bg-white/10 shrink-0 mx-1" />

          <button
            onClick={() => setIsBudgetOpen(true)}
            className="yt-pill shrink-0"
          >
            <span>Budget</span>
          </button>

          <button
            onClick={handleOpenToday}
            className="yt-pill yt-pill-red shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Today</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
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
            {/* YouTube-Style Pill Sub-navigation for Analytics */}
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              <button
                onClick={() => setAnalyticsSubTab('monthly')}
                className={`yt-pill flex-1 justify-center ${
                  analyticsSubTab === 'monthly' ? 'yt-pill-active' : ''
                }`}
              >
                Monthly Summary
              </button>
              <button
                onClick={() => setAnalyticsSubTab('yearly')}
                className={`yt-pill flex-1 justify-center ${
                  analyticsSubTab === 'yearly' ? 'yt-pill-active' : ''
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
          className="w-14 h-14 rounded-full btn-youtube-red flex items-center justify-center shadow-lg active:scale-95 transition-all"
          title="Log Today's Spending"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar with YouTube Styling */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-black/5 dark:border-white/10 px-4 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] z-30 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('monthView')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'monthView' ? 'text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('yearGrid')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'yearGrid' ? 'text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Months</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            activeTab === 'analytics' ? 'text-red-600 dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold transition-colors text-slate-500 dark:text-slate-400 hover:text-red-600"
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
