import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatCurrency, formatDisplayDate } from '../utils/dateHelpers';
import {
  X,
  Sun,
  Sunrise,
  Moon,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Banknote,
  CreditCard,
  Mic,
  MicOff,
  Sparkles,
  Utensils
} from 'lucide-react';

const SLOT_CONFIG = [
  {
    key: 'morning',
    title: 'Morning',
    sub: 'Breakfast / Chai / Snacks',
    icon: Sunrise,
    gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    borderColor: 'border-amber-500/25 focus-within:border-amber-400/50',
    glowColor: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]'
  },
  {
    key: 'afternoon',
    title: 'Afternoon',
    sub: 'Lunch / Beverages / Treats',
    icon: Sun,
    gradient: 'from-sky-500/15 via-blue-500/5 to-transparent',
    accentColor: 'text-sky-400',
    iconBg: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    borderColor: 'border-sky-500/25 focus-within:border-sky-400/50',
    glowColor: 'hover:shadow-[0_0_25px_-5px_rgba(14,165,233,0.25)]'
  },
  {
    key: 'night',
    title: 'Night',
    sub: 'Dinner / Desserts / Drinks',
    icon: Moon,
    gradient: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    accentColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    borderColor: 'border-purple-500/25 focus-within:border-purple-400/50',
    glowColor: 'hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.25)]'
  }
];

export default function DayEntrySheet({
  date,
  onClose,
  onSaved
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [listeningSlot, setListeningSlot] = useState(null);

  const [slots, setSlots] = useState({
    morning: { amount: '', payment_method: 'GPay', food_item: '', category: 'outside' },
    afternoon: { amount: '', payment_method: 'Cash', food_item: '', category: 'outside' },
    night: { amount: '', payment_method: 'GPay', food_item: '', category: 'outside' }
  });

  // Fetch current data for this day & food suggestions
  useEffect(() => {
    async function loadDay() {
      if (!date) return;
      setLoading(true);
      setError('');
      try {
        const [dayData, sugData] = await Promise.all([
          api.getDayExpenses(date),
          api.getFoodSuggestions().catch(() => ({ suggestions: [] }))
        ]);

        setDayOfWeek(dayData.day_of_week || '');
        if (sugData.suggestions) {
          setSuggestions(sugData.suggestions);
        }

        if (dayData.slots) {
          setSlots({
            morning: {
              amount: dayData.slots.morning?.amount > 0 ? dayData.slots.morning.amount.toString() : '',
              payment_method: dayData.slots.morning?.payment_method || 'GPay',
              food_item: dayData.slots.morning?.food_item || '',
              category: dayData.slots.morning?.category || 'outside'
            },
            afternoon: {
              amount: dayData.slots.afternoon?.amount > 0 ? dayData.slots.afternoon.amount.toString() : '',
              payment_method: dayData.slots.afternoon?.payment_method || 'Cash',
              food_item: dayData.slots.afternoon?.food_item || '',
              category: dayData.slots.afternoon?.category || 'outside'
            },
            night: {
              amount: dayData.slots.night?.amount > 0 ? dayData.slots.night.amount.toString() : '',
              payment_method: dayData.slots.night?.payment_method || 'GPay',
              food_item: dayData.slots.night?.food_item || '',
              category: dayData.slots.night?.category || 'outside'
            }
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load day expenses');
      } finally {
        setLoading(false);
      }
    }
    loadDay();
  }, [date]);

  // Live auto-calculation of Daily Total
  const morningAmt = parseFloat(slots.morning.amount) || 0;
  const afternoonAmt = parseFloat(slots.afternoon.amount) || 0;
  const nightAmt = parseFloat(slots.night.amount) || 0;
  const dailyTotal = morningAmt + afternoonAmt + nightAmt;

  const handleSlotChange = (slotKey, field, value) => {
    if (field === 'amount') {
      if (value !== '' && (parseFloat(value) < 0 || isNaN(value))) {
        return;
      }
    }
    setSlots((prev) => ({
      ...prev,
      [slotKey]: {
        ...prev[slotKey],
        [field]: value
      }
    }));
  };

  const handleQuickAdd = (slotKey, delta) => {
    const current = parseFloat(slots[slotKey].amount) || 0;
    const newAmt = Math.max(0, current + delta);
    handleSlotChange(slotKey, 'amount', newAmt.toString());
  };

  const handleApplySuggestion = (slotKey, item) => {
    setSlots((prev) => ({
      ...prev,
      [slotKey]: {
        ...prev[slotKey],
        food_item: item.food_item,
        amount: item.amount > 0 ? item.amount.toString() : prev[slotKey].amount,
        payment_method: item.payment_method || prev[slotKey].payment_method,
        category: item.category || prev[slotKey].category
      }
    }));
  };

  // Voice recognition parsing
  const handleStartVoice = (slotKey) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Android.');
      return;
    }

    if (listeningSlot === slotKey) {
      setListeningSlot(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListeningSlot(slotKey);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const lower = transcript.toLowerCase();

      // Extract amount
      const numberMatches = transcript.match(/\d+(?:[.,]\d+)?/g);
      let detectedAmount = '';
      if (numberMatches && numberMatches.length > 0) {
        detectedAmount = numberMatches[0].replace(',', '');
      }

      // Remove numbers and trigger words for food text
      let foodText = transcript
        .replace(/\b(?:rupees?|rs\.?|inr|for|spent|paid|bought|ate|eat|eating|had|have)\b/gi, '')
        .replace(/\d+(?:[.,]\d+)?/g, '')
        .trim();

      // Extract payment method
      let detectedPayment = '';
      if (lower.includes('gpay') || lower.includes('google pay') || lower.includes('upi') || lower.includes('paytm') || lower.includes('phonepe')) {
        detectedPayment = 'GPay';
        foodText = foodText.replace(/gpay|google pay|upi|paytm|phonepe/gi, '').trim();
      } else if (lower.includes('cash')) {
        detectedPayment = 'Cash';
        foodText = foodText.replace(/cash/gi, '').trim();
      } else if (lower.includes('card') || lower.includes('other')) {
        detectedPayment = 'Other';
        foodText = foodText.replace(/card|other/gi, '').trim();
      }

      foodText = foodText.replace(/^[\s,.-]+|[\s,.-]+$/g, '');

      setSlots((prev) => ({
        ...prev,
        [slotKey]: {
          ...prev[slotKey],
          amount: detectedAmount || prev[slotKey].amount,
          payment_method: detectedPayment || prev[slotKey].payment_method,
          category: 'outside',
          food_item: foodText || prev[slotKey].food_item
        }
      }));

      setListeningSlot(null);
    };

    recognition.onerror = (err) => {
      console.warn('Voice error:', err);
      setListeningSlot(null);
    };

    recognition.onend = () => {
      setListeningSlot(null);
    };

    recognition.start();
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        morning: {
          amount: Math.max(0, parseFloat(slots.morning.amount) || 0),
          payment_method: slots.morning.payment_method,
          food_item: slots.morning.food_item,
          category: slots.morning.category
        },
        afternoon: {
          amount: Math.max(0, parseFloat(slots.afternoon.amount) || 0),
          payment_method: slots.afternoon.payment_method,
          food_item: slots.afternoon.food_item,
          category: slots.afternoon.category
        },
        night: {
          amount: Math.max(0, parseFloat(slots.night.amount) || 0),
          payment_method: slots.night.payment_method,
          food_item: slots.night.food_item,
          category: slots.night.category
        }
      };

      await api.saveDayExpenses(date, payload);
      setSuccessMsg('Saved successfully!');
      setTimeout(() => {
        onSaved();
        onClose();
      }, 400);
    } catch (err) {
      setError(err.message || 'Failed to save entries');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete all entries for ${date}?`)) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await api.deleteDayExpenses(date);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete entries');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl bg-gradient-to-b from-surface-850 to-surface-900 border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-surface-950/40 backdrop-blur-xl shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-display font-black text-white tracking-tight">
                {formatDisplayDate(date)}
              </h2>
              {dayOfWeek && (
                <span className="text-xs px-2.5 py-0.5 rounded-full badge-theme font-bold uppercase tracking-wider font-display">
                  {dayOfWeek}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Log spending across Morning, Afternoon &amp; Night slots
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Slots Form */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-theme-subtle border border-theme-subtle text-theme-light text-xs flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-theme" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-theme-light" />
              <span className="text-sm font-medium">Loading day entries...</span>
            </div>
          ) : (
            <form id="day-form" onSubmit={handleSave} className="space-y-4">
              {SLOT_CONFIG.map((config) => {
                const Icon = config.icon;
                const slot = slots[config.key];
                const isListening = listeningSlot === config.key;

                const matchingSuggestions = suggestions
                  .filter((s) => !slot.food_item || s.food_item.toLowerCase().includes(slot.food_item.toLowerCase()))
                  .slice(0, 4);

                return (
                  <div
                    key={config.key}
                    className={`glass-panel p-4 sm:p-5 rounded-[24px] border ${config.borderColor} bg-gradient-to-r ${config.gradient} ${config.glowColor} transition-all duration-200`}
                  >
                    {/* Slot Header Bar */}
                    <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${config.iconBg} shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block font-display">
                            {config.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {config.sub}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Payment Method Dropdown */}
                        <select
                          value={slot.payment_method}
                          onChange={(e) =>
                            handleSlotChange(config.key, 'payment_method', e.target.value)
                          }
                          className="bg-surface-950/80 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-accent-rgb),0.3)] cursor-pointer shadow-inner"
                        >
                          <option value="GPay">GPay</option>
                          <option value="Cash">Cash</option>
                          <option value="Other">Other</option>
                        </select>

                        {/* Voice Input Button */}
                        <button
                          type="button"
                          onClick={() => handleStartVoice(config.key)}
                          className={`p-2 rounded-xl border transition-all ${
                            isListening
                              ? 'bg-rose-500 text-white recording-active border-rose-400 shadow-glow-rose'
                              : 'bg-surface-950/70 text-slate-400 hover:text-white hover:bg-white/[0.08] border-white/10'
                          }`}
                          title={isListening ? 'Listening... Speak now!' : 'Voice input (Speak amount & food)'}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Inputs: Amount and Food item */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                      {/* Amount Input */}
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-display">
                          Amount (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme font-mono font-black text-base">
                            ₹
                          </span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="0"
                            value={slot.amount}
                            onChange={(e) =>
                              handleSlotChange(config.key, 'amount', e.target.value)
                            }
                            className="w-full bg-surface-950/80 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-base font-mono font-black text-white focus:outline-none focus:border-theme focus:ring-2 focus:ring-[rgba(var(--theme-accent-rgb),0.25)] transition-all placeholder:text-slate-600 shadow-inner"
                          />
                        </div>

                        {/* Quick preset chips */}
                        <div className="flex items-center gap-1.5 mt-2">
                          {[50, 100, 200, 500].map((delta) => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => handleQuickAdd(config.key, delta)}
                              className="text-[10px] px-2 py-0.5 bg-white/[0.04] hover:bg-white/[0.1] active:scale-95 text-slate-300 hover:text-white rounded-lg font-mono font-bold border border-white/[0.06] transition-all"
                            >
                              +{delta}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Food Item / Description */}
                      <div className="sm:col-span-7">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                            What was eaten?
                          </label>
                          {isListening && (
                            <span className="text-[10px] text-rose-400 font-bold animate-pulse">
                              Listening... say e.g. "120 GPay Biryani"
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Dosa, Coffee, Meals, Snacks..."
                          value={slot.food_item}
                          onChange={(e) =>
                            handleSlotChange(config.key, 'food_item', e.target.value)
                          }
                          className="w-full bg-surface-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-theme focus:ring-2 focus:ring-[rgba(var(--theme-accent-rgb),0.25)] transition-all placeholder:text-slate-600 shadow-inner"
                        />

                        {/* Autocomplete suggestions chips */}
                        {matchingSuggestions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Quick add:</span>
                            </span>
                            {matchingSuggestions.map((sug) => (
                              <button
                                key={sug.food_item}
                                type="button"
                                onClick={() => handleApplySuggestion(config.key, sug)}
                                className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-theme-light border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
                              >
                                <span>{sug.food_item}</span>
                                {sug.amount > 0 && (
                                  <span className="text-theme-light font-mono font-bold">
                                    ₹{sug.amount}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </form>
          )}
        </div>

        {/* Footer: Live Daily Total & Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-surface-950/80 backdrop-blur-2xl shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Daily Total Display */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Day Total:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-theme-light font-mono tracking-tight" style={{ textShadow: '0 0 14px var(--theme-glow)' }}>
              {formatCurrency(dailyTotal)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {dailyTotal > 0 && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="px-3.5 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 active:scale-95 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Delete this day's entries"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="day-form"
              disabled={saving || loading}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl btn-theme-primary text-xs font-black tracking-wide transition-all shadow-theme-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Day</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
