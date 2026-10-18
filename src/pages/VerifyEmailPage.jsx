import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  MailCheck, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/OtpInput';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser, refreshUser } = useAuth();

  const queryEmail = new URLSearchParams(location.search).get('email') || '';
  const initialEmail = location.state?.email || queryEmail || '';
  const initialMessage = location.state?.message || null;

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(initialMessage);

  // 5-minute expiry countdown timer (300 seconds)
  const [expiresIn, setExpiresIn] = useState(300);

  // 60-second resend cooldown timer
  const [cooldown, setCooldown] = useState(60);

  // Expiration timer interval
  useEffect(() => {
    if (expiresIn <= 0) return;
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  // Cooldown timer interval
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleVerify = useCallback(async (otpToSubmit) => {
    const finalCode = otpToSubmit || code;
    if (!email.trim()) {
      setError("Email manzili topilmadi. Iltimos, qaytadan ro'yxatdan o'ting.");
      return;
    }
    if (!finalCode || finalCode.length !== 6) {
      setError("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/verify-email', {
        email: email.trim().toLowerCase(),
        code: finalCode.trim()
      });

      if (res.success && res.token) {
        localStorage.setItem('runcode_token', res.token);
        if (res.user) {
          try {
            localStorage.setItem('runcode_user', JSON.stringify(res.user));
          } catch {}
          updateUser(res.user);
        }
        await refreshUser();

        setSuccess("Email muvaffaqiyatli tasdiqlandi! Shaxsiy kabinetga yo'naltirilmoqdasiz...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(res.message || "Tasdiqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      setError(err.message || "Kod noto'g'ri yoki uning amal qilish muddati tugagan.");
    } finally {
      setLoading(false);
    }
  }, [email, code, navigate, updateUser, refreshUser]);

  // Auto-submit when user finishes typing 6 digits
  useEffect(() => {
    if (code.length === 6 && !loading) {
      handleVerify(code);
    }
  }, [code, handleVerify, loading]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    if (!email.trim()) {
      setError("Email manzili topilmadi.");
      return;
    }

    setResending(true);
    setError(null);

    try {
      const res = await api.post('/auth/resend-verification', {
        email: email.trim().toLowerCase()
      });

      if (res.success) {
        setSuccess("Yangi 6 xonali tasdiqlash kodi emailingizga muvaffaqiyatli yuborildi.");
        setCode('');
        setCooldown(res.remainingSeconds || 60);
        setExpiresIn(300);
      }
    } catch (err) {
      setError(err.message || "Kodni qayta yuborishda xatolik yuz berdi.");
      if (err.remainingSeconds) {
        setCooldown(err.remainingSeconds);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container-custom py-12 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-2xl space-y-7 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mx-auto">
            <MailCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Emailni Tasdiqlash</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            6 xonali tasdiqlash kodi quyidagi manzilga yuborildi:
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold break-all">
            {email || 'Email kiritilmagan'}
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
              6 xonali tasdiqlash kodini kiriting:
            </label>
            <OtpInput
              value={code}
              onChange={(val) => {
                setCode(val);
                if (error) setError(null);
              }}
              disabled={loading}
              isError={!!error}
              autoFocus={true}
            />
          </div>

          {/* Timers info */}
          <div className="flex items-center justify-between text-xs px-1 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Kod amal qilish muddati:</span>
              <span className={`font-mono font-bold ${expiresIn <= 60 ? 'text-rose-500' : 'text-gray-700 dark:text-gray-200'}`}>
                {formatTimer(expiresIn)}
              </span>
            </div>
            {expiresIn === 0 && (
              <span className="text-rose-500 font-bold text-[11px]">Muddati o'tdi</span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={() => handleVerify(code)}
            disabled={loading || code.length !== 6}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Emailni Tasdiqlash</span>
          </button>

          {/* Resend button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`text-xs font-semibold flex items-center justify-center space-x-1.5 mx-auto transition-colors ${
                cooldown > 0 || resending
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-brand-600 dark:text-brand-400 hover:underline cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 
                  ? `Kodni qayta yuborish (${cooldown} soniya)` 
                  : "Kodni qayta yuborish"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500">
          <Link
            to="/register"
            className="flex items-center space-x-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Emailni o'zgartirish</span>
          </Link>
          <Link
            to="/login"
            className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
          >
            Kirish sahifasi
          </Link>
        </div>

      </div>
    </div>
  );
};
