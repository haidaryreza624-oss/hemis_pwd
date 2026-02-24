import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { useSettings, getPrimaryBg, getPrimaryColor, getLightBg } from '../context/SettingsContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { color } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = (err as any)?.message || 'ایمیل یا رمز عبور اشتباه است.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`${getLightBg(color)} p-3 rounded-full mb-4`}>
            <GraduationCap className={getPrimaryColor(color)} size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">خوش آمدید</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">برای ورود به پورتال وارد شوید</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 overflow-hidden"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-left"
              placeholder="name@example.com"
              required
            />
          </div>
          {/* remember-me removed */}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-left"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${getPrimaryBg(color)} hover:opacity-90 text-white font-semibold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                در حال ورود...
              </>
            ) : (
              'ورود'
            )}
          </motion.button>
        </form>

        {/* Subtitle removed as requested */}
      </motion.div>
    </div>
  );
}
