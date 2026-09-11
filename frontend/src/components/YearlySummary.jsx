import React from 'react';
import { MONTH_NAMES, formatCurrency } from '../utils/dateHelpers';
import { Calendar, ChevronRight, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export default function YearlySummary({
  year,
  yearData,
  onSelectMonth
}) {
  const yearlyTotal = yearData?.yearlyTotal || 0;
  const months = yearData?.months || [];
  const maxMonthSpend = Math.max(...months.map((m) => m.total), 100);

  return (
    <div className="space-y-6">
      {/* Yearly Grand Total Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-black/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Annual Financial Summary</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
              {year} Grand Total
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Cumulative spending across all 12 months in {year}
            </p>
          </div>

          <div className="bg-black/50 border border-emerald-500/25 p-5 rounded-[24px] shrink-0 shadow-glow backdrop-blur-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Year Grand Total
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              {formatCurrency(yearlyTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Month-by-Month Visual Chart */}
      <div className="glass-panel p-5 sm:p-6 rounded-[28px] border border-white/10 space-y-4 shadow-xl">
        <div>
          <h2 className="text-base font-display font-bold text-white tracking-tight">
            Month-by-Month Spending
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual comparison of spending across the 12 months (Tap to inspect month)
          </p>
        </div>

        <div className="h-56 flex items-end gap-2 sm:gap-3 px-1 pt-8 overflow-x-auto">
          {months.map((m) => {
            const heightPercent = maxMonthSpend > 0 ? (m.total / maxMonthSpend) * 100 : 0;
            const hasSpend = m.total > 0;

            return (
              <button
                key={m.month}
                onClick={() => onSelectMonth(m.month)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                title={`${m.name}: ${formatCurrency(m.total)}`}
              >
                {/* Amount label */}
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-400 mb-1.5 truncate font-medium">
                  {hasSpend ? formatCurrency(m.total) : ''}
                </span>

                {/* Bar */}
                <div
                  className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 ${
                    hasSpend
                      ? 'bg-gradient-to-t from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 shadow-glow'
                      : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                  }`}
                  style={{ height: `${hasSpend ? Math.max(8, heightPercent) : 4}%` }}
                />

                {/* Month Name */}
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white mt-2 font-display">
                  {m.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Month-by-Month Detailed List */}
      <div className="glass-panel p-3 sm:p-4 rounded-[28px] border border-white/10 divide-y divide-white/[0.06] shadow-xl">
        {months.map((m) => {
          const hasSpend = m.total > 0;
          const pct = yearlyTotal > 0 ? Math.round((m.total / yearlyTotal) * 100) : 0;

          return (
            <button
              key={m.month}
              onClick={() => onSelectMonth(m.month)}
              className="w-full p-3.5 sm:p-4 flex items-center justify-between hover:bg-white/[0.04] rounded-2xl transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-300 group-hover:text-white flex items-center justify-center font-bold text-xs font-mono">
                  {m.month.toString().padStart(2, '0')}
                </div>
                <div>
                  <span className="text-sm sm:text-base font-display font-bold text-white group-hover:text-emerald-300 transition-colors block">
                    {m.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {m.entryCount} day{m.entryCount === 1 ? '' : 's'} with recorded expenses
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`text-base sm:text-lg font-black font-mono block tracking-tight ${
                      hasSpend ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {formatCurrency(m.total)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {pct}% of year
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
