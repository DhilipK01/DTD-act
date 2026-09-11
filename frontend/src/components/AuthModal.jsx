import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { BatarangIcon, ThanosSwordIcon } from './CustomIcons';

export default function AuthModal() {
  const { loginUser, signupUser } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [age, setAge] = useState('');

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await loginUser(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid Gmail / email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Please enter a valid age (1-120).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await signupUser({
        fullName: fullName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        age: ageNum
      });
      setSuccessMsg('Account created successfully! Logging you in...');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0f1424] to-[#07090f] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl logo-theme flex items-center justify-center font-black text-base tracking-wider mx-auto mb-3 shadow-theme-glow transition-transform hover:scale-105">
            DTD
          </div>
          <h1 className="text-2xl font-display font-black text-white tracking-tight">
            DTD
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {mode === 'signin'
              ? 'Sign in to access your personal spending dashboard'
              : 'Create your account to start tracking daily expenses'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-black/50 p-1 rounded-2xl border border-white/10 mb-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'signin'
                ? 'tab-theme-active font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'signup'
                ? 'tab-theme-active font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 relative z-10">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* MODE 1: Sign In Form */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4 relative z-10">
            {/* Email ID */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Gmail / Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 btn-theme-primary text-sm font-black tracking-wider transition-all shadow-theme-glow flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer mt-2 rounded-2xl uppercase"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Entering...</span>
                </>
              ) : (
                <>
                  <span>MEN ARE BRAVE</span>
                  <BatarangIcon className="w-5 h-5 shrink-0" />
                </>
              )}
            </button>

            {/* Switch to Signup */}
            <div className="pt-2 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="text-theme-light hover:underline font-bold"
              >
                Sign Up here
              </button>
            </div>
          </form>
        ) : (
          /* MODE 2: Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3.5 relative z-10">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </div>

            {/* Gmail ID */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Gmail ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="arun@gmail.com"
                  className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </div>

            {/* Password & Age side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-slate-600 shadow-inner font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 btn-theme-primary text-sm font-black tracking-wider transition-all shadow-theme-glow flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer mt-3 rounded-2xl uppercase"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Snapping...</span>
                </>
              ) : (
                <>
                  <span>I AM INEVITABLE</span>
                  <ThanosSwordIcon className="w-5 h-5 shrink-0" />
                </>
              )}
            </button>

            {/* Switch to Signin */}
            <div className="pt-1.5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="text-theme-light hover:underline font-bold"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
