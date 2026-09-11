import React, { useState } from 'react';
import {
  MONTH_NAMES,
  DAY_NAMES,
  formatCurrency,
  formatDateStr,
  getFirstDayOfMonth,
  getDaysInMonth
} from '../utils/dateHelpers';
import { exportMonthToCsv } from '../utils/exportCsv';
import PaymentBadge from './PaymentBadge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Target,
  Download,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Utensils
} from 'lucide-react';

export default function MonthCalendarView({
  year,
  month,
  monthData,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onBackToMonths,
  onOpenBudget
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // 0 = Sun

  const today = new Date();
  const isCurrentYear = today.getFullYear() === year;
  const isCurrentMonth = today.getMonth() + 1 === month;
  const todayDateNum = isCurrentYear && isCurrentMonth ? today.getDate() : null;

  // Map daily totals for fast lookup
  const dailyMap = {};
  if (monthData?.dailyTotals) {
    for (const d of monthData.dailyTotals) {
      dailyMap[d.day] = d;
    }
  }

  // Active days count
  const activeDaysCount = monthData?.dailyTotals?.filter((d) => d.total > 0).length || 0;

  return (
    <div className="space-y-4">
      {/* Month Header & Controls */}
      <div className="glass-panel p-4 sm:p-5 rounded-[28px] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMonths}
            className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-slate-300 hover:text-white rounded-2xl transition-all border border-white/10 shrink-0"
            title="Back to all months"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                {MONTH_NAMES[month - 1]} {year}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full badge-theme font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-accent)' }} />
                {activeDaysCount} active days
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap any date to log or update Morning, Afternoon &amp; Night spending
            </p>
          </div>
        </div>

        {/* Right: Controls & Monthly Total Pill */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap w-full sm:w-auto">
          {/* Monthly Total Pill */}
          <div className="bg-black/50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border flex items-center gap-2 shadow-inner" style={{ borderColor: 'rgba(var(--theme-accent-rgb), 0.35)' }}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total:</span>
            <span className="text-base sm:text-lg font-black text-theme-light font-mono tracking-tight" style={{ textShadow: '0 0 10px var(--theme-glow)' }}>
              {formatCurrency(monthData?.monthlyTotal || 0)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {/* Grid vs List toggle */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'tab-theme-active'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Calendar Grid"
              >
                <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'tab-theme-active'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Day List"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Action Buttons: Budget & Export */}
            <button
              onClick={onOpenBudget}
              className="p-1.5 sm:p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 rounded-xl transition-all border border-white/10"
              title="Set / Adjust Budget Target"
            >
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => exportMonthToCsv(year, month, MONTH_NAMES[month - 1], monthData?.dailyTotals || [])}
              className="p-1.5 sm:p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-emerald-400 rounded-xl transition-all border border-white/10"
              title="Export Month as CSV Spreadsheet"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Month Prev/Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevMonth}
                className="p-1.5 sm:p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-xl transition-all border border-white/10"
                title="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={onNextMonth}
                className="p-1.5 sm:p-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-xl transition-all border border-white/10"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Safe Daily Spend Banner */}
      {monthData?.budget && monthData.budget.amount > 0 && (
        <div className={`p-4 rounded-[24px] border flex flex-wrap items-center justify-between gap-3 shadow-lg ${
          monthData.budget.isOverBudget
            ? 'bg-gradient-to-r from-rose-950/40 via-rose-900/20 to-transparent border-rose-500/40 text-rose-300'
            : 'glass-panel border-white/10 text-slate-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              monthData.budget.isOverBudget
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow'
            }`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Monthly Budget: {formatCurrency(monthData.budget.amount)}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  monthData.budget.isOverBudget
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {monthData.budget.percentage}% spent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {monthData.budget.isOverBudget
                  ? 'Spending has exceeded your monthly target limit'
                  : `Safe Daily Allowance: ${formatCurrency(monthData.budget.safeDailySpend)}/day (${formatCurrency(monthData.budget.remaining)} remaining for ${monthData.budget.remainingDays} days)`}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBudget}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
          >
            Adjust Target
          </button>
        </div>
      )}

      {/* View Mode 1: Calendar Grid */}
      {viewMode === 'grid' ? (
        <div className="glass-panel p-3 sm:p-5 rounded-[28px] border border-white/10 shadow-xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2.5 text-center">
            {DAY_NAMES.map((d, i) => (
              <div
                key={d}
                className={`text-[11px] font-bold uppercase tracking-wider py-1.5 ${
                  i === 0 || i === 6 ? 'text-rose-400/90' : 'text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {/* Empty padding cells for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[56px] sm:min-h-[92px] rounded-xl sm:rounded-2xl bg-white/[0.01] border border-white/[0.03] opacity-25" />
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateStr(year, month, dayNum);
              const dayInfo = dailyMap[dayNum];
              const total = dayInfo?.total || 0;
              const hasEntries = total > 0;
              const isToday = dayNum === todayDateNum;

              return (
                <button
                  key={dayNum}
                  onClick={() => onSelectDate(dateStr)}
                  className={`min-h-[56px] sm:min-h-[92px] p-1.5 sm:p-3 rounded-xl sm:rounded-2xl text-left border flex flex-col justify-between transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                    isToday
                      ? 'cell-theme-today ring-1 sm:ring-2'
                      : hasEntries
                      ? 'border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] hover:shadow-lg'
                      : 'border-white/[0.04] bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03]'
                  }`}
                  style={isToday ? { '--tw-ring-color': 'var(--theme-accent)' } : {}}
                >
                  {/* Top: Day number & today marker */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] sm:text-sm font-bold rounded-lg sm:rounded-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isToday
                          ? 'btn-theme-primary font-black'
                          : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {hasEntries && (
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                        style={{ backgroundColor: 'var(--theme-accent)', boxShadow: '0 0 8px var(--theme-glow)' }}
                      />
                    )}
                  </div>

                  {/* Bottom: Daily Total */}
                  <div className="mt-1">
                    {hasEntries ? (
                      <span
                        className="text-[10px] sm:text-xs font-black text-theme-light font-mono tracking-tight block truncate"
                        style={{ textShadow: '0 0 8px var(--theme-glow)' }}
                      >
                        {formatCurrency(total)}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-600 font-mono group-hover:text-slate-500 transition-colors hidden sm:block">
                        —
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* View Mode 2: Day List */
        <div className="glass-panel p-4 sm:p-5 rounded-[28px] border border-white/10 space-y-2.5 shadow-xl">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = totalDays - idx; // reverse order: latest day on top
            const dateStr = formatDateStr(year, month, dayNum);
            const dayInfo = dailyMap[dayNum];
            const total = dayInfo?.total || 0;
            const hasEntries = total > 0;
            const isToday = dayNum === todayDateNum;

            return (
              <div
                key={dayNum}
                onClick={() => onSelectDate(dateStr)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isToday
                    ? 'border-theme cell-theme-today shadow-theme-glow'
                    : hasEntries
                    ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25'
                    : 'border-white/[0.03] bg-white/[0.01] hover:border-white/10 opacity-70'
                }`}
              >
                {/* Date & Indicator */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isToday ? 'btn-theme-primary font-black' : 'bg-white/[0.06] text-white'
                  }`}>
                    {dayNum}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {MONTH_NAMES[month - 1]} {dayNum}, {year}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tab-theme-active">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {hasEntries ? 'Tap to view or edit slot details' : 'No spending recorded yet'}
                    </span>
                  </div>
                </div>

                {/* Amount & Quick summary */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {hasEntries ? (
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-theme-light font-mono tracking-tight block" style={{ textShadow: '0 0 10px var(--theme-glow)' }}>
                        {formatCurrency(total)}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3 text-theme-light" />
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(dateStr);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
                    >
                      + Log Day
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
