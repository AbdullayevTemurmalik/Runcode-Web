import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Code2, 
  AlertCircle, 
  Loader2, 
  HelpCircle, 
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryMessage = new URLSearchParams(location.search).get('message');
  const [successBanner, setSuccessBanner] = useState(location.state?.message || queryMessage || null);

  useEffect(() => {
    if (location.state?.username) {
      setIdentifier(location.state.username);
    } else if (location.state?.email) {
      setIdentifier(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setLoading(true);
    setError(null);

    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email?email=${encodeURIComponent(identifier.trim())}`, {
          state: {
            email: identifier.trim(),
            message: err.message || "Hisobingiz hali tasdiqlanmagan. Iltimos, emailingizga yuborilgan 6 xonali tasdiqlash kodini kiriting."
          }
        });
        return;
      }
      setError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 sm:py-16 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-2xl space-y-7 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mx-auto">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Tizimga Kirish</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">RunCode platformasida o'qishni davom eting</p>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{successBanner}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            label="Email yoki Username:"
            icon={User}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="masalan: user@gmail.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Parol:
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Parolni unutdingizmi?</span>
              </Link>
            </div>
            
            <CustomInput
              icon={Lock}
              isPassword={true}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolingizni kiriting"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !identifier.trim() || !password}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Kirish</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white dark:bg-[#0c0d12] px-3 text-gray-400 font-semibold">yoki</span>
          </div>
        </div>

        {/* Google Continue Button */}
        <button
          type="button"
          onClick={() => {
            setError("Google OAuth orqali kirish hozirda faollashtirilmoqda. Iltimos, profilingiz email yoki username va paroli bilan kiring.");
          }}
          className="w-full py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google orqali kirish</span>
        </button>

        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-white/5">
          Akkauntingiz yo'qmi?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Ro'yxatdan o'tish (Sign Up)
          </Link>
        </p>

      </div>
    </div>
  );
};
