import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  Code2, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  AtSign,
  RefreshCw,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomDatePicker } from '../components/CustomDatePicker';
import { OtpInput } from '../components/OtpInput';
import { PasswordStrengthMeter, evaluatePassword } from '../components/PasswordStrengthMeter';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { updateUser, refreshUser } = useAuth();

  // 3-Bosqichli Wizard: 1 = Shaxsiy ma'lumotlar, 2 = Email & OTP, 3 = Parol o'rnatish
  const [step, setStep] = useState(1);

  // STEP 1 Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState(''); // 'YYYY-MM-DD'
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // { available: boolean, message: string }

  // STEP 2 Fields
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailToken, setEmailToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [expiresIn, setExpiresIn] = useState(300);
  const [cooldown, setCooldown] = useState(0);

  // STEP 3 Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [completing, setCompleting] = useState(false);

  // Global Alerts
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Timers for Step 2 OTP
  React.useEffect(() => {
    if (step !== 2 || !otpSent || expiresIn <= 0) return;
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, otpSent, expiresIn]);

  React.useEffect(() => {
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

  const passwordEvaluation = evaluatePassword(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // ----------------------------------------------------
  // STEP 1: Personal Details Validation & Progression
  // ----------------------------------------------------
  const handleStep1Next = async (e) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || firstName.trim().length < 2) {
      setError("Ismingizni to'liq kiriting (kamida 2 ta harf).");
      return;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      setError("Familiyangizni to'liq kiriting (kamida 2 ta harf).");
      return;
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanUsername || cleanUsername.length < 3) {
      setError("Username kamida 3 ta belgidan iborat bo'lishi kerak (harf, raqam yoki tagchiziq).");
      return;
    }

    if (!birthDate || birthDate.split('-').length < 3 || birthDate.includes('--')) {
      setError("Tug'ilgan kuningiz, oyi va yilini to'liq tanlang.");
      return;
    }

    // Check username availability on backend
    setUsernameChecking(true);
    try {
      const res = await api.post('/auth/check-username', { username: cleanUsername });
      if (!res.available) {
        setError("Ushbu username band. Iltimos, boshqa username tanlang.");
        setUsernameStatus({ available: false, message: "Band" });
        return;
      }
      setUsernameStatus({ available: true, message: "Mavjud" });
      setStep(2);
    } catch (err) {
      setError(err.message || "Username tekshirishda xatolik yuz berdi.");
    } finally {
      setUsernameChecking(false);
    }
  };

  // ----------------------------------------------------
  // STEP 2: Send OTP via Brevo & Verify
  // ----------------------------------------------------
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError("Yaroqli email manzilini kiriting (masalan: user@gmail.com).");
      return;
    }

    setSendingOtp(true);
    setError(null);

    try {
      const res = await api.post('/auth/send-signup-otp', {
        email: cleanEmail,
        firstName: firstName.trim()
      });

      if (res.success) {
        setOtpSent(true);
        setOtpCode('');
        setExpiresIn(300);
        setCooldown(60);
        setSuccessMessage("6 xonali tasdiqlash kodi emailingizga muvaffaqiyatli yuborildi.");
      }
    } catch (err) {
      setError(err.message || "Tasdiqlash kodini yuborishda xatolik yuz berdi.");
      if (err.remainingSeconds) {
        setCooldown(err.remainingSeconds);
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const finalCode = codeToVerify || otpCode;
    if (!finalCode || finalCode.length !== 6) {
      setError("Iltimos, 6 xonali tasdiqlash kodini to'liq kiriting.");
      return;
    }

    setVerifyingOtp(true);
    setError(null);

    try {
      const res = await api.post('/auth/verify-signup-otp', {
        email: email.trim().toLowerCase(),
        code: finalCode.trim()
      });

      if (res.success && res.emailToken) {
        setEmailToken(res.emailToken);
        setSuccessMessage("Emailingiz muvaffaqiyatli tasdiqlandi!");
        setTimeout(() => {
          setSuccessMessage(null);
          setStep(3);
        }, 800);
      } else {
        setError(res.message || "Tasdiqlash kodi noto'g'ri.");
      }
    } catch (err) {
      setError(err.message || "Tasdiqlash kodi noto'g'ri yoki muddati tugagan.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Auto-verify OTP when 6 digits are typed
  React.useEffect(() => {
    if (step === 2 && otpSent && otpCode.length === 6 && !verifyingOtp) {
      handleVerifyOtp(otpCode);
    }
  }, [step, otpSent, otpCode]);

  // ----------------------------------------------------
  // STEP 3: Complete Registration with Password
  // ----------------------------------------------------
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordEvaluation.isValid) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi, 1 ta katta harf va 1 ta raqam o'z ichiga olishi shart.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kiritilgan parollar bir-biriga mos kelmadi.");
      return;
    }

    if (!emailToken) {
      setError("Email tasdiqlash tokeni topilmadi. Iltimos, 2-bosqichga qaytib emailni qayta tasdiqlang.");
      setStep(2);
      return;
    }

    setCompleting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

      const res = await api.post('/auth/complete-signup', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: cleanUsername,
        birthDate,
        email: cleanEmail,
        emailToken,
        password,
        confirmPassword
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

        setSuccessMessage("Tabriklaymiz! Ro'yxatdan muvaffaqiyatli o'tdingiz. Shaxsiy kabinetga yo'naltirilmoqdasiz...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(res.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="container-custom py-12 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-2xl space-y-6 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mx-auto">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ro'yxatdan O'tish</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {step === 1 && "1-qadam: Shaxsiy ma'lumotlaringizni kiriting"}
            {step === 2 && "2-qadam: Email manzilingizni tasdiqlang"}
            {step === 3 && "3-qadam: Akkauntingiz uchun xavfsiz parol o'rnating"}
          </p>
        </div>

        {/* 3-Bosqichli Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-1">
            <span className={step >= 1 ? 'text-brand-500 font-extrabold' : ''}>1. Ma'lumotlar</span>
            <span className={step >= 2 ? 'text-brand-500 font-extrabold' : ''}>2. Email Tasdiqlash</span>
            <span className={step >= 3 ? 'text-brand-500 font-extrabold' : ''}>3. Parol</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'bg-brand-500 shadow-sm shadow-brand-500/30'
                    : s < step
                    ? 'bg-emerald-500'
                    : 'bg-gray-200 dark:bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* BOSQICH 1: Ism, Familiya, Username, Tug'ilgan sana        */}
        {/* ========================================================= */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4 animate-in fade-in">
            
            {/* Ism va Familiya */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomInput
                label="Ism:"
                icon={User}
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ali"
              />

              <CustomInput
                label="Familiya:"
                icon={User}
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Valiyev"
              />
            </div>

            {/* Username */}
            <CustomInput
              label="Username:"
              icon={AtSign}
              required
              value={username}
              onChange={(e) => {
                const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                setUsername(val);
                setUsernameStatus(null);
                if (error) setError(null);
              }}
              placeholder="alivaliyev"
              inputClassName="font-mono"
              sublabel={
                usernameStatus ? (
                  <span className={`text-[10px] font-bold ${usernameStatus.available ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {usernameStatus.message}
                  </span>
                ) : null
              }
            />

            {/* Tug'ilgan sana: Kun, Oy, Yil (Yosh so'ralmaydi) */}
            <CustomDatePicker
              label="Tug'ilgan sana:"
              sublabel="Kun • Oy • Yil"
              required={true}
              value={birthDate}
              onChange={(val) => {
                setBirthDate(val);
                if (error) setError(null);
              }}
            />

            {/* Davom etish tugmasi */}
            <button
              type="submit"
              disabled={usernameChecking || !firstName.trim() || !lastName.trim() || !username.trim() || !birthDate}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {usernameChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Keyingi: Email Tasdiqlash</span>
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* BOSQICH 2: Email so'rash va Brevo OTP tasdiqlash         */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            
            {/* Email Input */}
            <div className="space-y-2">
              <CustomInput
                label="Email manzil:"
                icon={Mail}
                type="email"
                required
                disabled={otpSent}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="alivaliyev@gmail.com"
              />

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !email.trim()}
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer mt-2"
                >
                  {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>Tasdiqlash Kodini Olish</span>
                </button>
              )}
            </div>

            {/* OTP input appears once code is sent */}
            {otpSent && (
              <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-white/5 animate-in fade-in">
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Emailingizga yuborilgan 6 xonali tasdiqlash kodini kiriting:
                  </p>
                  <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-bold">
                    {email}
                  </p>
                </div>

                <OtpInput
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (error) setError(null);
                  }}
                  disabled={verifyingOtp}
                  isError={!!error}
                  autoFocus={true}
                />

                <div className="flex items-center justify-between text-xs px-1 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>Muddati:</span>
                    <span className={`font-mono font-bold ${expiresIn <= 60 ? 'text-rose-500' : 'text-gray-700 dark:text-gray-200'}`}>
                      {formatTimer(expiresIn)}
                    </span>
                  </div>
                  {expiresIn === 0 && (
                    <span className="text-rose-500 font-bold text-[11px]">Muddati o'tdi</span>
                  )}
                </div>

                {/* Tasdiqlash tugmasi */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp(otpCode)}
                  disabled={verifyingOtp || otpCode.length !== 6}
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Kodni Tasdiqlash</span>
                </button>

                {/* Qayta yuborish */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={cooldown > 0 || sendingOtp}
                    className={`text-xs font-semibold flex items-center justify-center space-x-1.5 mx-auto transition-colors ${
                      cooldown > 0 || sendingOtp
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-brand-600 dark:text-brand-400 hover:underline cursor-pointer'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${sendingOtp ? 'animate-spin' : ''}`} />
                    <span>
                      {cooldown > 0 
                        ? (cooldown > 60 ? `Kodni qayta yuborish (${formatTimer(cooldown)})` : `Kodni qayta yuborish (${cooldown}s)`)
                        : "Kodni qayta yuborish"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation back */}
            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError(null);
                }}
                className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>1-bosqichga qaytish</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* BOSQICH 3: Akkaunt ma'lumotlari chiqib, Parol o'rnatish   */}
        {/* ========================================================= */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-5 animate-in fade-in">
            
            {/* Tasdiqlangan Akkaunt Kartasi */}
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Akkaunt ma'lumotlari
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Tasdiqlangan
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block">Username:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">@{username}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Email:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white truncate block">{email}</span>
                </div>
              </div>
            </div>

            {/* Parol o'rnatish */}
            <div className="space-y-2">
              <CustomInput
                label="Akkaunt uchun yangi parol:"
                icon={Lock}
                isPassword={true}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Kamida 8 ta belgi, 1 ta katta harf, 1 ta raqam"
                sublabel={
                  password ? (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${passwordEvaluation.badgeBg}`}>
                      {passwordEvaluation.label}
                    </span>
                  ) : null
                }
              />

              <PasswordStrengthMeter password={password} showRequirements={true} />
            </div>

            {/* Parolni tasdiqlash */}
            <div className="space-y-1">
              <CustomInput
                label="Parolni tasdiqlang:"
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

            {/* Ro'yxatdan o'tishni yakunlash tugmasi */}
            <button
              type="submit"
              disabled={completing || !passwordEvaluation.isValid || !passwordsMatch}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer mt-3"
            >
              {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Ro'yxatdan O'tishni Yakunlash</span>
            </button>
          </form>
        )}

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-white/5">
          Profilingiz bormi?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
            Kirish (Sign In)
          </Link>
        </p>

      </div>
    </div>
  );
};
