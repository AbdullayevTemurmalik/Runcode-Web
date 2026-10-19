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
