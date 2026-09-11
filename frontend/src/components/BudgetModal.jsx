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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0e1320] to-[#080b12] border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black shadow-glow">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white tracking-tight">
                Monthly Budget Target
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {MONTH_NAMES[month - 1]} {year}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-black text-xl font-mono">
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
                className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-4 py-3.5 text-xl font-mono font-bold focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Suggestions
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[8000, 12000, 15000, 20000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className="py-2 px-2 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-xs font-mono font-bold text-slate-200 rounded-xl transition-all text-center border border-white/10"
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
              className="w-4 h-4 rounded border-white/20 text-emerald-500 focus:ring-emerald-500 bg-black/50 cursor-pointer"
            />
            <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
              Apply as default monthly target for future months
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black tracking-wide transition-all shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
