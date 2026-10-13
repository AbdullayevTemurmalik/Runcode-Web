import React, { useState } from 'react';
import { 
  Tag, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  Percent,
  Flame
} from 'lucide-react';
import { useActivePromocode } from '../hooks/useActivePromocode';

export const PromocodeInputBox = ({ className = '' }) => {
  const { 
    activePromo, 
    countdownText, 
    isApplied, 
    applyPromocode, 
    removePromocode 
  } = useActivePromocode();

  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatted = inputCode.trim().toUpperCase();
    if (!formatted) {
      setErrorMsg('Iltimos, promokod nomini kiriting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await applyPromocode(formatted);
      setSuccessMsg(res.message || 'Promokod muvaffaqiyatli faollashtirildi!');
      setInputCode('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Promokod yaroqsiz yoki topilmadi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removePromocode();
    setInputCode('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className={`w-full max-w-2xl mx-auto my-8 ${className}`}>
      {isApplied ? (
        /* Faol Promokod Bloki */
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:via-[#0c1618] dark:to-teal-950/30 border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/10 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Chap taraf: Promokod nomi va chegirma foizi */}
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30 shadow-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-mono text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-wider uppercase px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-white/10 border border-emerald-500/30 shadow-xs">
                    {activePromo.code}
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    <Percent className="w-3 h-3 mr-0.5" />
                    {activePromo.discountPercent}% Chegirma Faol
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 font-medium">
                  Barcha tarif kartalarida chegirmali narxlar aks etmoqda
                </p>
              </div>
            </div>

            {/* O'ng taraf: Qolgan vaqt countdown taymeri */}
            <div className="flex items-center space-x-3 self-end sm:self-center flex-shrink-0">
              {countdownText && (
                <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-black/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm font-black shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>{countdownText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Promokod Kiritish Formasi */
        <div className="rounded-3xl p-4 sm:p-5 bg-white/90 dark:bg-[#0f1422]/90 backdrop-blur-xl border border-gray-200/90 dark:border-white/[0.08] shadow-lg shadow-gray-200/40 dark:shadow-black/30 transition-all">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-200">
                  Promokod bormi?
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                Chegirmaga ega bo'lish uchun kodni kiriting
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase().replace(/\s+/g, ''));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="KODNI KIRITING (MASALAN: RUNCODE2026)"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-xs sm:text-sm font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 uppercase transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !inputCode.trim()}
                className="px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-brand-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Tekshirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Faollashtirish</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
