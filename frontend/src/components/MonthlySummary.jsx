import React from 'react';
import { MONTH_NAMES, formatCurrency } from '../utils/dateHelpers';
import { exportMonthToCsv } from '../utils/exportCsv';
import {
  Smartphone,
  Banknote,
  CreditCard,
  TrendingUp,
  Target,
  Download,
  Utensils,
  ShieldCheck,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function MonthlySummary({
  year,
  month,
  monthData,
  onSelectDate,
  onOpenBudgetModal
}) {
  const monthlyTotal = monthData?.monthlyTotal || 0;
  const daysInMonth = monthData?.daysInMonth || 30;
  const avgDaily = Math.round(monthlyTotal / (daysInMonth || 1));

  const gpay = monthData?.paymentBreakdown?.GPay || { amount: 0, percentage: 0 };
  const cash = monthData?.paymentBreakdown?.Cash || { amount: 0, percentage: 0 };
  const other = monthData?.paymentBreakdown?.Other || { amount: 0, percentage: 0 };

  const slotTotals = monthData?.slotTotals || { morning: 0, afternoon: 0, night: 0 };
  const dailyTotals = monthData?.dailyTotals || [];
  const budget = monthData?.budget || { amount: 0, remaining: 0, isOverBudget: false, safeDailySpend: 0, percentage: 0 };

  const maxDaySpend = Math.max(...dailyTotals.map((d) => d.total), 100);

  const handleExport = () => {
    exportMonthToCsv(year, month, MONTH_NAMES[month - 1], dailyTotals);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar: Export & Budget Target */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 sm:p-4 rounded-[24px] border border-white/10 shadow-lg">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>Financial summary for <strong className="text-white font-bold">{MONTH_NAMES[month - 1]} {year}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-bold transition-all border border-white/10"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>{budget.amount > 0 ? 'Adjust Budget' : 'Set Budget'}</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black transition-all shadow-glow hover:brightness-110 active:scale-95"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Hero Overview: 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Spend */}
        <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Total Spent
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/[0.06]">
              {daysInMonth} days
            </span>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight block drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
            {formatCurrency(monthlyTotal)}
          </span>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Sum of all meals and daily time slots
          </p>
        </div>

        {/* Daily Average */}
        <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 flex flex-col justify-between bg-gradient-to-br from-white/[0.03] to-transparent shadow-xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Daily Average
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {formatCurrency(avgDaily)}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Average expenditure per day</span>
          </div>
        </div>

        {/* Budget Target & Safe Daily Spend Card */}
        <div className={`glass-panel p-5 sm:p-6 rounded-[28px] border flex flex-col justify-between shadow-xl ${
          budget.isOverBudget
            ? 'border-rose-500/40 bg-rose-950/20 shadow-glow-rose'
            : budget.amount > 0
            ? 'border-emerald-500/30 bg-emerald-950/15 shadow-glow'
            : 'border-white/10 bg-white/[0.02]'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Safe Daily Spend
              </span>
              {budget.isOverBudget && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Over Budget
                </span>
              )}
            </div>

            {budget.amount > 0 ? (
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {formatCurrency(budget.safeDailySpend)}
                  <span className="text-xs font-normal text-slate-400 font-sans">/day</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  {budget.remaining > 0
                    ? `${formatCurrency(budget.remaining)} left for ${budget.remainingDays} days`
                    : 'Budget exceeded for this month'}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-sm font-semibold text-slate-400 block mt-1">
                  No budget target set
                </span>
                <button
                  onClick={onOpenBudgetModal}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-1.5 block"
                >
                  + Set a target budget
                </button>
              </div>
            )}
          </div>

          {budget.amount > 0 && (
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-3 border border-white/[0.05]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budget.isOverBudget
                    ? 'bg-rose-500 shadow-glow-rose'
                    : budget.percentage > 80
                    ? 'bg-amber-400 shadow-glow-amber'
                    : 'bg-emerald-400 shadow-glow'
                }`}
                style={{ width: `${Math.min(100, budget.percentage)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Breakdown (GPay vs Cash vs Other) */}
      <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 space-y-4 shadow-xl">
        <div>
          <h2 className="text-base font-display font-bold text-white tracking-tight">
            Payment Method Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare GPay vs Cash vs Other transactions
          </p>
        </div>

        {/* Visual Distribution Bar */}
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden flex gap-1 p-0.5 border border-white/[0.06]">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 rounded-l-full"
            style={{ width: `${gpay.percentage}%` }}
            title={`GPay: ${gpay.percentage}%`}
          />
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${cash.percentage}%` }}
            title={`Cash: ${cash.percentage}%`}
          />
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500 rounded-r-full"
            style={{ width: `${other.percentage}%` }}
            title={`Other: ${other.percentage}%`}
          />
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* GPay Card */}
          <div className="bg-black/40 border border-blue-500/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300 block">GPay</span>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(gpay.amount)}
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-mono">
              {gpay.percentage}%
            </span>
          </div>

          {/* Cash Card */}
          <div className="bg-black/40 border border-emerald-500/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300 block">Cash</span>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(cash.amount)}
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
              {cash.percentage}%
            </span>
          </div>

          {/* Other Card */}
          <div className="bg-black/40 border border-purple-500/25 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-300 block">Other</span>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(other.amount)}
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono">
              {other.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Time Slot Breakdown: Morning, Afternoon, Night */}
      <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 space-y-4 shadow-xl">
        <div>
          <h2 className="text-base font-display font-bold text-white tracking-tight">
            Spending by Time Slot
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare morning breakfast, afternoon lunch, and night dinner expenses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-amber-500/15 to-transparent border border-amber-500/30 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Morning 🌅
            </span>
            <span className="text-xl font-black text-white font-mono mt-1.5 block">
              {formatCurrency(slotTotals.morning)}
            </span>
          </div>

          <div className="bg-gradient-to-br from-sky-500/15 to-transparent border border-sky-500/30 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
              Afternoon ☀️
            </span>
            <span className="text-xl font-black text-white font-mono mt-1.5 block">
              {formatCurrency(slotTotals.afternoon)}
            </span>
          </div>

          <div className="bg-gradient-to-br from-purple-500/15 to-transparent border border-purple-500/30 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
              Night 🌙
            </span>
            <span className="text-xl font-black text-white font-mono mt-1.5 block">
              {formatCurrency(slotTotals.night)}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Spending Chart */}
      <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-display font-bold text-white tracking-tight">
              Daily Spend Chart
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily totals across the month (Tap any bar to edit that day)
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Day 1 – {daysInMonth}</span>
        </div>

        {/* Bar Graph */}
        <div className="pt-8 pb-2 overflow-x-auto">
          <div className="min-w-[500px] h-44 flex items-end gap-1.5 px-2">
            {dailyTotals.map((d) => {
              const heightPercent = maxDaySpend > 0 ? (d.total / maxDaySpend) * 100 : 0;
              const hasSpend = d.total > 0;

              return (
                <button
                  key={d.day}
                  onClick={() => onSelectDate(d.date)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  title={`Day ${d.day}: ${formatCurrency(d.total)}`}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-black/90 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 border border-white/20">
                    Day {d.day}: {formatCurrency(d.total)}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      hasSpend
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 shadow-glow'
                        : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                    }`}
                    style={{ height: `${hasSpend ? Math.max(8, heightPercent) : 4}%` }}
                  />

                  {/* Day Label */}
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-emerald-400 mt-2 font-medium">
                    {d.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
