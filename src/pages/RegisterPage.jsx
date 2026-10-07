import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Phone, 
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
  const [phone, setPhone] = useState('+998 ');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate birth date
    if (!birthDate || birthDate.split('-').length < 3 || birthDate.includes('--')) {
      setError('Iltimos, tug\'ilgan kuningiz, oyi va yilini to\'liq tanlang.');
      return;
    }

    // Validate phone number
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 12) {
      setError('Telefon raqamini to\'liq kiriting: +998 90 123 45 67');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/register', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        password,
        birthDate,
        phone: phone.trim()
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

          {/* 3. Parol (Custom Eye Toggle bilan) */}
          <CustomInput
            label="Parol:"
            icon={Lock}
            isPassword={true}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kamida 6 ta belgi"
          />

          {/* 4. Tug'ilgan sana: 100% CUSTOM Dizayndagi DatePicker (Kun, Oy, Yil) */}
          <CustomDatePicker
            label="Tug'ilgan sana:"
            sublabel="Kun • Oy • Yil"
            required={true}
            value={birthDate}
            onChange={(val) => setBirthDate(val)}
          />

          {/* 5. Telefon raqami: Custom Phone Input (+998 auto-format) */}
          <CustomInput
            label="Telefon raqami:"
            icon={Phone}
            isPhone={true}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+998 90 123 45 67"
            inputClassName="font-mono font-medium"
            sublabel={
              phone.replace(/\D/g, '').length >= 12 ? (
                <span className="text-emerald-500 font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> To'g'ri format
                </span>
              ) : null
            }
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
