import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      toast.success('Admin login successful. Welcome!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultAdmin = () => {
    setEmail('admin@mylocal.org');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to public directory</span>
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Project Administration
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sign in to manage services, categories, survey records, and website content.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-800/90 border border-slate-700/80 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700 focus-within:ring-2 focus-within:ring-teal-500">
                <Mail className="w-4 h-4 text-slate-400 ml-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@mylocal.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700 focus-within:ring-2 focus-within:ring-teal-500">
                <Lock className="w-4 h-4 text-slate-400 ml-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow transition active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-Fill Button */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <button
              type="button"
              onClick={fillDefaultAdmin}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-600/50 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span>Click to auto-fill default admin credentials</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Default: <code className="text-teal-300">admin@mylocal.org</code> / <code className="text-teal-300">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
