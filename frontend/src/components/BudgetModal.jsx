import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MONTH_NAMES, formatCurrency } from '../utils/dateHelpers';
import { Target, X, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

export default function BudgetModal({
  year,
  month,
  currentBudget = 0,
  onClose,
  onBudgetUpdated
}) {
  const [budgetAmount, setBudgetAmount] = useState(currentBudget ? currentBudget.toString() : '');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentBudget) {
      setBudgetAmount(currentBudget.toString());
    }
  }, [currentBudget]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const amt = Math.max(0, parseFloat(budgetAmount) || 0);
      await api.setMonthlyBudget(year, month, amt, setAsDefault);
      onBudgetUpdated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update monthly budget');
    } finally {
      setSaving(false);
    }
  };

  const handlePreset = (val) => {
    setBudgetAmount(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-950 border border-black/10 dark:border-white/10 rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black tracking-tight">
                Monthly Budget Target
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {MONTH_NAMES[month - 1]} {year}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-600 dark:text-red-400 font-black text-xl font-mono">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="0"
                autoFocus
                placeholder="e.g. 15000"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full glass-input rounded-2xl pl-10 pr-4 py-3.5 text-xl font-mono font-bold transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Quick Suggestions
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[8000, 12000, 15000, 20000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className="py-2 px-2 yt-pill active:scale-95 text-xs font-mono font-bold justify-center"
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Default Option Checkbox */}
          <label className="flex items-center gap-3 pt-1 cursor-pointer group">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Apply as default monthly target for future months
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full yt-pill justify-center text-xs font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-full btn-youtube-red text-xs font-black tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
