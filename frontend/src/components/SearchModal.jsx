import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatCurrency, formatDisplayDate } from '../utils/dateHelpers';
import PaymentBadge from './PaymentBadge';
import { Search, X, Calendar, Utensils, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export default function SearchModal({ onClose, onSelectDate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await api.searchExpenses({
        q: searchTerm,
        payment_method: paymentMethod
      });
      setResults(data.results || []);
      setTotalSpend(data.totalSpend || 0);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run search with a brief debounce when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, paymentMethod]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface-950 border border-black/10 dark:border-white/10 rounded-[28px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black tracking-tight">
                Search Expenses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Search by food item or filter by payment method
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input & Payment Filter */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] space-y-3.5 shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          {/* Text Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food eaten (e.g. Biryani, Dosa, Tea, Coffee)..."
              className="w-full glass-input rounded-2xl pl-11 pr-10 py-3 text-sm transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Payment Method Filter Pills */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Payment:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'GPay', 'Cash', 'Other'].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`yt-pill ${
                    paymentMethod === m ? 'yt-pill-active' : ''
                  }`}
                >
                  {m === 'all' ? 'All' : m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Stats Bar */}
        <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0 bg-black/[0.01] dark:bg-white/[0.01]">
          <span>
            Found <strong className="text-slate-900 dark:text-white font-bold">{results.length}</strong> entries
          </span>
          <span>
            Total Spent: <strong className="text-red-600 dark:text-red-400 font-mono font-bold">{formatCurrency(totalSpend)}</strong>
          </span>
        </div>

        {/* Results List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 divide-y divide-black/[0.06] dark:divide-white/[0.06] space-y-1">
          {loading ? (
            <div className="py-14 text-center text-slate-400 flex flex-col items-center gap-2.5">
              <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
              <span className="text-xs font-medium">Searching expenses...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-14 text-center text-slate-500">
              <Utensils className="w-10 h-10 mx-auto text-slate-700 mb-2.5" />
              <p className="text-sm font-semibold text-slate-300">No matching expenses found</p>
              <p className="text-xs text-slate-500 mt-1">Try another food keyword or reset filters</p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.expense_id || `${item.date}-${item.time_slot}`}
                onClick={() => {
                  onSelectDate(item.date);
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex flex-col items-center justify-center text-slate-300 font-mono shrink-0 group-hover:border-emerald-500/40 transition-colors">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {item.time_slot ? item.time_slot[0].toUpperCase() : 'M'}
                    </span>
                    <span className="text-sm font-black text-white">
                      {item.date.split('-')[2]}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-display font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                      <span>{item.food_item || '(Unspecified meal)'}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{formatDisplayDate(item.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{item.time_slot}</span>
                      <span>•</span>
                      <PaymentBadge method={item.payment_method} size="sm" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                    {formatCurrency(item.amount)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
