
import React, { useState } from 'react';
import { LogIn, Mail, Lock, ShieldAlert, Info, Database, Globe } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isFirebaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Hardcoded restriction as requested
    if (email !== 'mehedi.admin@gmail.com') {
      setError("Access Denied: Only mehedi.admin@gmail.com permitted.");
      setLoading(false);
      return;
    }

    if (password !== '123456') {
      setError("Invalid password. Please use '123456'.");
      setLoading(false);
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err: any) {
      console.error(err);
      // If Firebase isn't configured, App.tsx will handle the local login
      // This catch is for actual Firebase errors if keys ARE provided
      if (err.code === 'auth/network-request-failed') {
        setError("Network error. Check your connection.");
      } else {
        setError(err.message || "An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/30 mb-6">
            <LogIn size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Family Cost</h1>
          <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">Admin Control Panel</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className={`mb-6 p-4 rounded-2xl flex gap-3 items-start border ${configured ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
            {configured ? (
              <>
                <Globe size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">Cloud Mode Active</p>
                  <p className="text-[10px] font-medium text-emerald-700 leading-tight">Connected to Firebase. Data will sync across all devices.</p>
                </div>
              </>
            ) : (
              <>
                <Database size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider mb-1">Local Mode Active</p>
                  <p className="text-[10px] font-medium text-amber-700 leading-tight">Firebase keys missing. You can still login to test locally.</p>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mehedi.admin@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Access Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold uppercase leading-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 uppercase text-sm tracking-widest shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Secure Multi-Device Sync • v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
