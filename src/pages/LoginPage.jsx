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
  Search, 
  X, 
  CheckCircle2, 
  UserPlus, 
  KeyRound 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CustomInput } from '../components/CustomInput';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(location.state?.message || null);

  // Parolni unutdingizmi modal holatlari
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(null);

  useEffect(() => {
    if (location.state?.username) {
      setIdentifier(location.state.username);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Akkauntni qidirish
  const handleFindAccount = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError(null);
    setNotFound(false);
    setFoundUser(null);
    setResetSuccess(null);

    try {
      const res = await api.post('/auth/find-account', { searchQuery: searchQuery.trim() });
      if (res.success && res.user) {
        setFoundUser(res.user);
      }
    } catch (err) {
      setNotFound(true);
      setSearchError(err.message || 'Bunday akkaunt topilmadi. Iltimos, ro\'yxatdan o\'tish (Sign Up) bo\'limiga o\'ting.');
    } finally {
      setSearching(false);
    }
  };

  // Yangi parolni saqlash
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!foundUser || !newPassword) return;

    setResetting(true);
    setSearchError(null);

    try {
      const res = await api.post('/auth/reset-password', {
        userId: foundUser.id,
        newPassword
      });

      if (res.success) {
        setResetSuccess(res.message || 'Parolingiz muvaffaqiyatli yangilandi! Endi yangi parol bilan kirishingiz mumkin.');
        setPassword('');
        setIdentifier(foundUser.username);
        setTimeout(() => {
          setShowForgotModal(false);
          resetModalState();
        }, 2500);
      }
    } catch (err) {
      setSearchError(err.message || 'Parolni yangilashda xatolik yuz berdi');
    } finally {
      setResetting(false);
    }
  };

  const resetModalState = () => {
    setSearchQuery('');
    setSearchError(null);
    setNotFound(false);
    setFoundUser(null);
    setNewPassword('');
    setResetSuccess(null);
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
            label="Username yoki Email:"
            icon={User}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="masalan: alivaliyev"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Parol:
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setNotFound(false);
                  setSearchError(null);
                }}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Parolni unutdingizmi?</span>
              </button>
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
            disabled={loading}
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

      {/* Parolni Tiklash Modali (Custom Dizaynda) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0f111a] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95">
            
            {/* Modal Yopish */}
            <button
              onClick={() => {
                setShowForgotModal(false);
                resetModalState();
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Parolni Qayta Tiklash
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Profilingizni topish uchun username yoki ism-familiyangizni kiriting
              </p>
            </div>

            {/* Qidirish formasi */}
            <form onSubmit={handleFindAccount} className="space-y-3">
              <CustomInput
                label="Username yoki Ism Familiya:"
                icon={Search}
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masalan: alivaliyev yoki Ali Valiyev"
              />

              <button
                type="submit"
                disabled={searching || !searchQuery.trim()}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-md shadow-brand-500/20"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Akkauntni Qidirish</span>
              </button>
            </form>

            {/* Agar Akkaunt Topilmasa: User talabi bo'yicha ogohlantirish va Sign Up havolasi */}
            {notFound && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                    {searchError || "Akkaunt yo'q ekan, ro'yxatdan o'tish (Sign Up) ga o'ting"}
                  </div>
                </div>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetModalState();
                      navigate('/register');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Ro'yxatdan o'tish (Sign Up)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Agar Akkaunt Topilsa: Yangi parol kiritish bo'limi */}
            {foundUser && (
              <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-white/10">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                      Akkaunt topildi!
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      {foundUser.fullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      @{foundUser.username} {foundUser.maskedPhone ? `• ${foundUser.maskedPhone}` : ''}
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                </div>

                {resetSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{resetSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <CustomInput
                      label="Yangi Parol:"
                      icon={Lock}
                      isPassword={true}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Kamida 6 ta belgi"
                    />

                    <button
                      type="submit"
                      disabled={resetting || !newPassword}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Parolni yangilash</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
