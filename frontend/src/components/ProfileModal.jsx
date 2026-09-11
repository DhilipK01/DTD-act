import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Calendar,
  Lock,
  ShieldCheck,
  X,
  LogOut,
  Hash,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function ProfileModal({ onClose }) {
  const { user, logoutUser } = useAuth();

  // Format joining date
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Member';

  // Extract initials
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email[0].toUpperCase()
    : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0f1424] to-[#07090f] border border-white/10 rounded-[32px] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>User Profile</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-2xl transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar & Main Identity Card */}
        <div className="py-6 text-center relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 mx-auto mb-3 shadow-glow">
            <div className="w-full h-full bg-[#0d121f] rounded-[22px] flex items-center justify-center text-emerald-400 font-display font-black text-2xl">
              {initials}
            </div>
          </div>

          <h2 className="text-xl font-display font-black text-white tracking-tight">
            {user?.fullName || 'Expense Tracker User'}
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mt-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Personal Account</span>
          </div>
        </div>

        {/* Non-Editable Details (Read-Only) */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Account Information
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Read-Only</span>
            </span>
          </div>

          {/* Full Name Card */}
          <div className="bg-black/40 border border-white/[0.08] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.05] text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="text-sm font-bold text-white">
                  {user?.fullName || 'Not specified'}
                </span>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {/* Gmail / Email ID Card */}
          <div className="bg-black/40 border border-white/[0.08] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.05] text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Gmail / Email ID
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {user?.email || '—'}
                </span>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {/* Age Card */}
          <div className="bg-black/40 border border-white/[0.08] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.05] text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Age
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {user?.age ? `${user.age} years` : 'Not provided'}
                </span>
              </div>
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </div>

          {/* Member Since Card */}
          <div className="bg-black/40 border border-white/[0.08] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.05] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Member Since
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Logout & Close */}
        <div className="pt-6 mt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
          <button
            onClick={() => {
              onClose();
              logoutUser();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold transition-all border border-white/10 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
