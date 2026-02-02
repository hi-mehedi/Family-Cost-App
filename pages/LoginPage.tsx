import React, { useState } from 'react';
import { LogIn, Mail, Lock, ShieldAlert, Cloud } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Enforce admin restriction
    if (email !== 'mehedi.admin@gmail.com') {
      setError("Unauthorized User: This device is restricted to admin control.");
      setLoading(false);
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Invalid credentials. Please use the master admin password.");
      } else if (err.code === 'auth/user-not-found') {
        setError("User record not found in cloud project.");
      } else {
        setError("Cloud Auth Error: " + (err.message || "Unknown error"));
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
          <div className="mb-6 p-4 rounded-2xl flex gap-3 items-start border bg-indigo-50 border-indigo-100">
            <Cloud size={20} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wider mb-1">Cloud Protected</p>
              <p className="text-[10px] font-medium text-slate-600 leading-tight">Your data is securely synced to your private Firebase cloud infrastructure.</p>
            </div>
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
          Cloud Management System • v3.0
        </p>
      </div>
    </div>
  );
};

export default LoginPage;