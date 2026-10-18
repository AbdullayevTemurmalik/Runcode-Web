import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail,
  ArrowRight, 
  Code2, 
  AlertCircle, 
  Loader2,
  Calendar,
  CheckCircle2,
  Hash
} from 'lucide-react';
import api from '../services/api';
import { CustomInput } from '../components/CustomInput';
import { CustomDatePicker } from '../components/CustomDatePicker';
import { PasswordStrengthMeter, evaluatePassword } from '../components/PasswordStrengthMeter';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); // 'YYYY-MM-DD'
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Auto-calculate age whenever birthDate changes
  useEffect(() => {
    if (!birthDate) return;
    const parts = birthDate.split('-');
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const birth = new Date(year, month, day);

      if (!isNaN(birth.getTime())) {
        const today = new Date();
        let calculated = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          calculated--;
        }
        if (calculated >= 0 && calculated <= 120) {
          setAge(String(calculated));
        }
      }
    }
  }, [birthDate]);

  const passwordEvaluation = evaluatePassword(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors = {};

    if (!firstName.trim() || firstName.trim().length < 2) {
      errors.firstName = "Ismingizni kiriting (kamida 2 ta harf).";
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      errors.lastName = "Familiyangizni kiriting (kamida 2 ta harf).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = "Yaroqli email manzilini kiriting (masalan: user@gmail.com).";
    }

    if (!birthDate || birthDate.split('-').length < 3 || birthDate.includes('--')) {
      errors.birthDate = "Tug'ilgan kuningiz, oyi va yilini to'liq tanlang.";
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 7 || parsedAge > 120) {
      errors.age = "Yosh 7 dan 120 gacha bo'lishi kerak.";
    }

    if (!passwordEvaluation.isValid) {
      errors.password = "Parol barcha xavfsizlik talablariga javob berishi shart.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Tasdiqlash paroli mos kelmadi.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Iltimos, shakldagi barcha xatoliklarni to'g'rilang.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await api.post('/auth/signup', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        birthDate,
        age: parsedAge,
        password,
        confirmPassword
      });

      if (res.success) {
        navigate(`/verify-email?email=${encodeURIComponent(cleanEmail)}`, {
          state: {
            email: cleanEmail,
            message: res.message || "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi. Tasdiqlash kodi emailingizga yuborildi."
          }
        });
      }
    } catch (err) {
      const errMsg = err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.";
      setError(errMsg);
      if (err.field) {
        setFieldErrors(prev => ({ ...prev, [err.field]: errMsg }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0d12]/95 border border-gray-200 dark:border-white/10 shadow-2xl space-y-7 animate-in fade-in">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 mx-auto">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ro'yxatdan O'tish</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">RunCode platformasida professional ta'limni boshlang</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Ism va Familiya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput
              label="Ism:"
              icon={User}
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: null }));
              }}
              placeholder="Ali"
              error={fieldErrors.firstName}
            />

            <CustomInput
              label="Familiya:"
              icon={User}
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: null }));
              }}
              placeholder="Valiyev"
              error={fieldErrors.lastName}
            />
          </div>

          {/* 2. Email */}
          <CustomInput
            label="Email manzil:"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
            }}
            placeholder="alivaliyev@gmail.com"
            error={fieldErrors.email}
          />

          {/* 3. Tug'ilgan sana va Yosh */}
          <div className="space-y-3">
            <CustomDatePicker
              label="Tug'ilgan sana:"
              sublabel="Kun • Oy • Yil"
              required={true}
              value={birthDate}
              onChange={(val) => {
                setBirthDate(val);
                if (fieldErrors.birthDate) setFieldErrors(prev => ({ ...prev, birthDate: null }));
              }}
              error={fieldErrors.birthDate}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomInput
                label="Yosh:"
                icon={Hash}
                type="number"
                min={7}
                max={120}
                required
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (fieldErrors.age) setFieldErrors(prev => ({ ...prev, age: null }));
                }}
                placeholder="20"
                sublabel={age ? `${age} yosh` : "Sanadan avtomatik hisoblanadi"}
                error={fieldErrors.age}
              />
            </div>
          </div>

          {/* 4. Parol va Kuchlilik indikatori */}
          <div className="space-y-2">
            <CustomInput
              label="Parol:"
              icon={Lock}
              isPassword={true}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
              }}
              placeholder="Kamida 8 ta belgi, bosh/kichik harf, raqam, belgi"
              error={fieldErrors.password}
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

          {/* 5. Parolni tasdiqlash */}
          <div className="space-y-1">
            <CustomInput
              label="Parolni tasdiqlang:"
              icon={Lock}
              isPassword={true}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Parolni qayta kiriting"
              error={fieldErrors.confirmPassword}
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
            {passwordsMismatch && (
              <p className="text-[11px] text-rose-500 font-medium">Parollar bir-biriga mos kelmadi.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-3 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Ro'yxatdan O'tish</span>
          </button>
        </form>

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
