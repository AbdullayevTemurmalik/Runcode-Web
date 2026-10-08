import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Code2, 
  AlertCircle, 
  Loader2, 
  AtSign,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { CustomInput } from '../components/CustomInput';
import { CustomDatePicker } from '../components/CustomDatePicker';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(''); // 'YYYY-MM-DD'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parol murakkabligi tahlili
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '', percent: 0, hasMinLength: false, hasNumber: false, hasUpper: false };
    
    const hasMinLength = pass.length >= 6;
    const hasNumber = /\d/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    let points = 0;
    if (hasMinLength) points += 1;
    if (hasNumber) points += 1;
    if (hasUpper) points += 1;
    if (hasLower) points += 0.5;
    if (hasSpecial) points += 1;
    if (pass.length >= 10) points += 0.5;

    const meetsBase = hasMinLength && hasNumber && hasUpper;

    if (!meetsBase || points < 2) {
      return {
        score: 1,
        label: 'Oson',
        color: 'text-rose-500',
        barColor: 'bg-rose-500',
        badgeBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        percent: 25,
        hasMinLength,
        hasNumber,
        hasUpper
      };
    }

    if (points < 3.5) {
      return {
        score: 2,
        label: "O'rta",
        color: 'text-amber-500',
        barColor: 'bg-amber-500',
        badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        percent: 50,
        hasMinLength,
        hasNumber,
        hasUpper
      };
    }

    if (points < 4.5) {
      return {
        score: 3,
        label: 'Qiyin',
        color: 'text-blue-500',
        barColor: 'bg-blue-500',
        badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        percent: 75,
        hasMinLength,
        hasNumber,
        hasUpper
      };
    }

    return {
      score: 4,
      label: 'Mukammal',
      color: 'text-emerald-500',
      barColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      percent: 100,
      hasMinLength,
      hasNumber,
      hasUpper
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate password requirements
    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Parolda kamida 1 ta katta harf (A-Z) bo'lishi shart.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Parolda kamida 1 ta raqam (0-9) bo'lishi shart.");
      return;
    }

    // Validate birth date
    if (!birthDate || birthDate.split('-').length < 3 || birthDate.includes('--')) {
      setError('Iltimos, tug\'ilgan kuningiz, oyi va yilini to\'liq tanlang.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        password,
        birthDate
      });

      if (data.success) {
        // Sign Up dan keyin to'g'ri kirmaydi, Sign In (Login) ga o'tadi!
        navigate('/login', {
          state: {
            message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz! Iltimos, username va parolingiz bilan tizimga kiring.',
            username: username.trim().toLowerCase()
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
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
          <p className="text-xs text-gray-500 dark:text-gray-400">RunCode bilan professional dasturlashni boshlang</p>
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
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ali"
            />

            <CustomInput
              label="Familiya:"
              icon={User}
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Valiyev"
            />
          </div>

          {/* 2. Username */}
          <CustomInput
            label="Username:"
            icon={AtSign}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="alivaliyev"
            inputClassName="font-mono"
          />

          {/* 3. Parol (Custom Eye Toggle bilan va Dinamik Murakkablik Ko'rsatkichi) */}
          <div className="space-y-2">
            <CustomInput
              label="Parol:"
              icon={Lock}
              isPassword={true}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi, 1 ta katta harf, 1 ta raqam"
              sublabel={
                password ? (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${passwordStrength.badgeBg}`}>
                    {passwordStrength.label}
                  </span>
                ) : null
              }
            />

            {/* Parol kuchi indikatori (Progress Bar & Talablar) */}
            {password && (
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2 text-xs">
                {/* 4 bosqichli bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-500">Parol xavfsizligi:</span>
                    <span className={passwordStrength.color}>{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.barColor}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                </div>

                {/* Talablar ro'yxati */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                  <div className={`flex items-center space-x-1 font-semibold ${
                    passwordStrength.hasMinLength ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-white/20 inline-block flex-shrink-0" />
                    )}
                    <span>6+ ta belgi</span>
                  </div>

                  <div className={`flex items-center space-x-1 font-semibold ${
                    passwordStrength.hasUpper ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                    {passwordStrength.hasUpper ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-white/20 inline-block flex-shrink-0" />
                    )}
                    <span>Katta harf (A-Z)</span>
                  </div>

                  <div className={`flex items-center space-x-1 font-semibold ${
                    passwordStrength.hasNumber ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-white/20 inline-block flex-shrink-0" />
                    )}
                    <span>Raqam (0-9)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Tug'ilgan sana: 100% CUSTOM Dizayndagi DatePicker (Kun, Oy, Yil) */}
          <CustomDatePicker
            label="Tug'ilgan sana:"
            sublabel="Kun • Oy • Yil"
            required={true}
            value={birthDate}
            onChange={(val) => setBirthDate(val)}
          />

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
