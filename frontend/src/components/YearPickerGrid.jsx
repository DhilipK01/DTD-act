import React from 'react';
import { MONTH_NAMES, formatCurrency } from '../utils/dateHelpers';
import { ChevronRight, Calendar, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export default function YearPickerGrid({
  year,
  yearData,
  onSelectMonth
}) {
  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  // Find maximum monthly total to scale progress bars
  const maxMonthSpend = Math.max(
    ...(yearData?.months?.map((m) => m.total) || [0]),
    1
  );

  return (
    <div className="space-y-6">
      {/* Year Overview Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-black/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Calendar className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Yearly Overview</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              {year} Spending
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Select any month below to view or edit daily time-slot logs
            </p>
          </div>

          <div className="bg-black/50 border border-emerald-500/25 p-5 rounded-[24px] flex items-center gap-5 shrink-0 shadow-glow backdrop-blur-xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Grand Total
              </span>
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                {formatCurrency(yearData?.yearlyTotal || 0)}
              </span>
            </div>
            <div className="pl-5 border-l border-white/10 hidden sm:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Monthly Avg
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-200 font-mono">
                {formatCurrency(yearData?.averageMonthlySpend || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Interactive Grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Select a Month</span>
            <span className="text-[11px] font-normal text-slate-500">(Tap to open days)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {MONTH_NAMES.map((name, idx) => {
            const monthNum = idx + 1;
            const monthObj = yearData?.months?.find((m) => m.month === monthNum);
            const total = monthObj?.total || 0;
            const isCurrentMonth = year === currentYearNum && monthNum === currentMonthNum;
            const hasEntries = total > 0;
            const percentageOfMax = Math.min(100, Math.round((total / maxMonthSpend) * 100));

            return (
              <button
                key={name}
                onClick={() => onSelectMonth(monthNum)}
                className={`glass-panel glass-panel-interactive p-4 sm:p-5 rounded-[24px] text-left border relative group transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden ${
                  isCurrentMonth
                    ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-950/30 to-transparent shadow-glow'
                    : 'border-white/[0.06] hover:border-emerald-500/40'
                }`}
              >
                {/* Top: Month Name & Current Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {name}
                  </span>
                  {isCurrentMonth ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-sm">
                      Current
                    </span>
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  )}
                </div>

                {/* Middle: Month Total */}
                <div className="my-2">
                  <span
                    className={`text-base sm:text-xl font-black font-mono tracking-tight block ${
                      hasEntries
                        ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                        : 'text-slate-500 font-medium'
                    }`}
                  >
                    {hasEntries ? formatCurrency(total) : '—'}
                  </span>
                </div>

                {/* Bottom: Relative Spend Progress Bar */}
                <div className="w-full">
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${hasEntries ? Math.max(5, percentageOfMax) : 0}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
