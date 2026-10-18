import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { CustomInput } from '../components/CustomInput';
import { OtpInput } from '../components/OtpInput';
import { PasswordStrengthMeter, evaluatePassword } from '../components/PasswordStrengthMeter';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Wizard steps: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  // Timers for Step 2
  const [expiresIn, setExpiresIn] = useState(300);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (step !== 2 || expiresIn <= 0) return;
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, expiresIn]);

  useEffect(() => {
    if (step !== 2 || cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, cooldown]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const passwordEvaluation = evaluatePassword(newPassword);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  // STEP 1: Submit Email for Recovery
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Iltimos, to'g'ri email manzilini kiriting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });

      // Account enumeration protection: always proceed to step 2 with reassuring message
      setInfoMessage(res.message || "Agar ushbu email tizimda mavjud bo'lsa, 6 xonali tiklash kodi yuborildi.");
      setStep(2);
      setExpiresIn(300);
      setCooldown(60);
    } catch (err) {
      // Even if network or rate limit, display message
      setError(err.message || "Tiklash so'rovini yuborishda xatolik yuz berdi.");
      if (err.remainingSeconds) {
        setCooldown(err.remainingSeconds);
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      setError("Iltimos, 6 xonali tiklash kodini to'liq kiriting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/verify-reset-otp', {
        email: email.trim().toLowerCase(),
        otpCode: otpCode.trim(),
        code: otpCode.trim()
      });

      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
        setError(null);
        setInfoMessage(null);
      } else {
        setError(res.message || "Tiklash kodi noto'g'ri.");
      }
    } catch (err) {
      setError(err.message || "Kiritilgan kod noto'g'ri yoki uning muddati o'tgan.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP in Step 2
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError(null);

    try {
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase()
      });

      setInfoMessage(res.message || "Yangi 6 xonali tiklash kodi yuborildi.");
      setOtpCode('');
      setCooldown(60);
      setExpiresIn(300);
    } catch (err) {
      setError(err.message || "Kodni qayta yuborishda xatolik yuz berdi.");
      if (err.remainingSeconds) {
        setCooldown(err.remainingSeconds);
      }
    } finally {
      setResending(false);
    }
  };

  // Auto-verify when 6 digits are typed in Step 2
  useEffect(() => {
    if (step === 2 && otpCode.length === 6 && !loading) {
      handleVerifyOtp();
    }
  }, [step, otpCode]);

  // STEP 3: Reset Password with Authorization Token
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordEvaluation.isValid) {
      setError("Parol barcha xavfsizlik talablariga javob berishi shart.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yangi parollar bir-biriga mos kelmadi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
        confirmPassword
      });

      if (res.success) {
        setStep(4);
      } else {
        setError(res.message || "Parolni o'zgartirishda xatolik yuz berdi.");
      }
    } catch (err) {
      setError(err.message || "Parolni yangilashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-2xl space-y-7 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mx-auto">
            {step === 4 ? (
              <CheckCircle2 className="w-8 h-8 text-white" />
            ) : (
              <KeyRound className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {step === 1 && "Parolni Tiklash"}
            {step === 2 && "Kodni Tasdiqlash"}
            {step === 3 && "Yangi Parol O'rnatish"}
            {step === 4 && "Muvaffaqiyatli Yangilandi"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {step === 1 && "Profilingizga bog'langan email manzilini kiriting"}
            {step === 2 && "Emailingizga yuborilgan 6 xonali tiklash kodini kiriting"}
            {step === 3 && "Hisobingiz uchun yangi va kuchli parol tanlang"}
            {step === 4 && "Hisobingiz xavfsizligi yangilandi"}
          </p>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-brand-500'
                    : s < step
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-gray-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <CustomInput
              label="Email manzil:"
              icon={Mail}
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="alivaliyev@gmail.com"
            />

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Tiklash Kodini Olish</span>
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Emailingizga yuborilgan 6 xonali tiklash kodini kiriting:
              </p>
              <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-bold">
                {email}
              </p>
            </div>

            <div className="space-y-2">
              <OtpInput
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (error) setError(null);
                }}
                disabled={loading}
                isError={!!error}
                autoFocus={true}
              />
            </div>

            <div className="flex items-center justify-between text-xs px-1 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                <span>Muddati:</span>
                <span className={`font-mono font-bold ${expiresIn <= 60 ? 'text-rose-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {formatTimer(expiresIn)}
                </span>
              </div>
              {expiresIn === 0 && (
                <span className="text-rose-500 font-bold text-[11px]">Muddati tugadi</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Kodni Tasdiqlash</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
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
                    ? (cooldown > 60 ? `Kodni qayta yuborish (${formatTimer(cooldown)})` : `Kodni qayta yuborish (${cooldown}s)`)
                    : "Kodni qayta yuborish"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <CustomInput
                label="Yangi parol:"
                icon={Lock}
                isPassword={true}
                required
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Kamida 8 ta belgi, bosh/kichik harf, raqam, belgi"
                sublabel={
                  newPassword ? (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${passwordEvaluation.badgeBg}`}>
                      {passwordEvaluation.label}
                    </span>
                  ) : null
                }
              />
              <PasswordStrengthMeter password={newPassword} showRequirements={true} />
            </div>

            <div className="space-y-1">
              <CustomInput
                label="Yangi parolni tasdiqlang:"
                icon={Lock}
                isPassword={true}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Parolni qayta kiriting"
                sublabel={
                  confirmPassword ? (
                    passwordsMatch ? (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mos keldi
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-500 font-bold">
                        Mos kelmadi
                      </span>
                    )
                  ) : null
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading || !passwordEvaluation.isValid || !passwordsMatch}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Yangi Parolni Saqlash</span>
            </button>
          </form>
        )}

        {/* STEP 4: Success View */}
        {step === 4 && (
          <div className="space-y-6 text-center animate-in zoom-in-95">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
              Parolingiz muvaffaqiyatli yangilandi! Xavfsizlik yuzasidan barcha faol qurilmalardagi sessiyalar yakunlandi va profilingizga ogohlantirish xabari yuborildi.
            </div>

            <button
              type="button"
              onClick={() => navigate('/login', { state: { message: "Parol yangilandi. Yangi parolingiz bilan tizimga kiring." } })}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Tizimga Kirish</span>
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/5 text-center text-xs text-gray-500">
          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 text-brand-600 dark:text-brand-400 font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kirish sahifasiga qaytish</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
