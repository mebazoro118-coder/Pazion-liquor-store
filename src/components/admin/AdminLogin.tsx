import React, { useState } from 'react';
import { Wine, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onSuccess?: () => void;
  onReturnToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onReturnToStore }) => {
  const { login, simulateAdminSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your administrative email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Invalid administrative credentials or insufficient authorization.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'owner' | 'admin' | 'manager', emailAddr: string) => {
    simulateAdminSession(role, emailAddr);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-900 text-stone-100 mb-4 shadow-sm">
            <Wine className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-serif tracking-wide text-stone-900 uppercase">
            Pazion Liquor Store
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">
            Administrative Control Panel
          </p>
        </div>

        {/* Card Container */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 border border-stone-200 shadow-sm rounded-lg">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                  Staff Authentication
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sign in with verified credentials to manage store operations.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-stone-400" />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {forgotSent && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
                Password recovery instructions have been dispatched to your verified email.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pazionliquor.com"
                  required
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="text-xs text-stone-500 hover:text-stone-900 underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-[11px] text-stone-400">TLS 256-bit Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Staff Role Access (Owner, Admin, Manager) */}
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 text-center">
                One-Click Role Authentication
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('owner', 'mebazoro118@gmail.com')}
                  className="px-2 py-2 border border-stone-200 hover:border-stone-900 rounded text-[11px] text-stone-700 hover:text-stone-900 font-medium text-center bg-stone-50 hover:bg-white transition"
                >
                  <span className="block font-bold text-stone-900">Owner</span>
                  <span className="text-[10px] text-stone-400">Full Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin', 'admin@pazionliquor.com')}
                  className="px-2 py-2 border border-stone-200 hover:border-stone-900 rounded text-[11px] text-stone-700 hover:text-stone-900 font-medium text-center bg-stone-50 hover:bg-white transition"
                >
                  <span className="block font-bold text-stone-900">Admin</span>
                  <span className="text-[10px] text-stone-400">Operations</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('manager', 'manager@pazionliquor.com')}
                  className="px-2 py-2 border border-stone-200 hover:border-stone-900 rounded text-[11px] text-stone-700 hover:text-stone-900 font-medium text-center bg-stone-50 hover:bg-white transition"
                >
                  <span className="block font-bold text-stone-900">Manager</span>
                  <span className="text-[10px] text-stone-400">Store Staff</span>
                </button>
              </div>
            </div>

            {/* Link back to customer store */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onReturnToStore}
                className="text-xs text-stone-500 hover:text-stone-900 underline transition"
              >
                Return to Customer Website (pazionliquor.com)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted area. All administrative modifications are audited.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
