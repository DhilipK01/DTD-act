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
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export default function AuthModal() {
  const { loginUser, signupUser, loginWithOtp, sendOtpCode, resetPasswordUser } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
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

  // Reset / OTP Form State
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

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

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = (resetEmail || loginEmail).trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setError('Please enter a valid Gmail / email address to receive the verification code.');
      return;
    }

    setSendingOtp(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await sendOtpCode(targetEmail);
      setOtpSent(true);
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
      setSuccessMsg(res.message || `Verification code sent to ${targetEmail}. Check your email.`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpDirectLogin = async () => {
    const targetEmail = (resetEmail || loginEmail).trim();
    if (!targetEmail || !otp.trim()) {
      setError('Please enter your email and 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await loginWithOtp(targetEmail, otp.trim());
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    const targetEmail = (resetEmail || loginEmail).trim();

    if (!targetEmail || !otp.trim() || !newPassword) {
      setError('Please fill in your email, verification code, and new password.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await resetPasswordUser({
        email: targetEmail,
        otp: otp.trim(),
        newPassword
      });
      setSuccessMsg('Password updated successfully! Logging you in...');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your verification code.');
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
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 shadow-[0_0_30px_rgba(16,185,129,0.35)] border border-white/20 bg-black transition-transform hover:scale-105 duration-200">
            <img
              src="/dtd-logo.png"
              alt="DTD Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-display font-black text-white tracking-tight">
            DTD
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {mode === 'signin' && 'Sign in to access your personal spending dashboard'}
            {mode === 'signup' && 'Create your account to start tracking daily expenses'}
            {mode === 'reset' && 'Reset your password or sign in with email OTP code'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up vs Reset/OTP */}
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
          <button
            type="button"
            onClick={() => {
              setMode('reset');
              setError('');
              setSuccessMsg('');
              if (loginEmail && !resetEmail) setResetEmail(loginEmail);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              mode === 'reset'
                ? 'tab-theme-active font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reset / OTP
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <span className="font-medium">{error}</span>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    if (loginEmail) setResetEmail(loginEmail);
                    setError('');
                  }}
                  className="block mt-1 text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Forgot password or need to sign in with OTP?
                </button>
              )}
            </div>
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
        {mode === 'signin' && (
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    if (loginEmail) setResetEmail(loginEmail);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
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
              className="w-full py-3.5 px-4 btn-theme-primary text-sm font-black tracking-wider transition-all shadow-theme-glow flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer mt-2 rounded-2xl uppercase group"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Entering...</span>
                </>
              ) : (
                <>
                  <span>MEN ARE BRAVE</span>
                  <div className="h-7 w-14 rounded-lg overflow-hidden bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                    <img
                      src="/batarang.png"
                      alt="Batarang"
                      className="w-full h-full object-cover"
                    />
                  </div>
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
        )}

        {/* MODE 2: Sign Up Form */}
        {mode === 'signup' && (
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
              className="w-full py-3.5 px-4 btn-theme-primary text-sm font-black tracking-wider transition-all shadow-theme-glow flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer mt-3 rounded-2xl uppercase group"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Snapping...</span>
                </>
              ) : (
                <>
                  <span>I AM INEVITABLE</span>
                  <div className="h-7 w-14 rounded-lg overflow-hidden bg-black/60 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <img
                      src="/thanos-sword.png"
                      alt="Thanos Sword"
                      className="w-full h-full object-cover"
                    />
                  </div>
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

        {/* MODE 3: Reset Password / OTP Login */}
        {mode === 'reset' && (
          <div className="space-y-4 relative z-10">
            {/* Email Field with Send Code button */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Your Registered Gmail ID
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="dhilip17mk@gmail.com"
                    className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !resetEmail.trim()}
                  className="px-4 py-2.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 rounded-2xl text-xs font-bold transition-all disabled:opacity-40 shrink-0 flex items-center gap-1.5"
                >
                  {sendingOtp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <KeyRound className="w-3.5 h-3.5" />
                  )}
                  <span>{otpSent ? 'Resend' : 'Get Code'}</span>
                </button>
              </div>
            </div>

            {/* Dev Mode Auto-fill prompt if SMTP not configured */}
            {devOtp && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dev OTP: <strong className="font-mono text-amber-200 tracking-wider text-sm">{devOtp}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-[11px] font-bold text-amber-200 border border-amber-500/40 transition-colors"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {/* Verification Code input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full bg-black/60 border border-white/10 text-white font-mono tracking-widest text-center rounded-2xl pl-10 pr-4 py-2.5 text-base focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:tracking-normal placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </div>

            {/* New Password field (Optional if just doing quick OTP login, or required for reset) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                New Password (To Reset)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full bg-black/60 border border-white/10 text-white rounded-2xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading || !otp || !newPassword || !resetEmail}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black tracking-wider transition-all rounded-2xl uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-40"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Set New Password & Sign In</span>
              </button>

              <button
                type="button"
                onClick={handleOtpDirectLogin}
                disabled={loading || !otp || !resetEmail}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Instant Sign In with Code Only</span>
              </button>
            </div>

            {/* Back to Sign In */}
            <div className="pt-2 text-center text-xs text-slate-400">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-theme-light hover:underline font-bold"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
