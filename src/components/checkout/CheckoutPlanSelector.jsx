import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Clock, 
  Info, 
  Loader2 
} from 'lucide-react';

export const CheckoutPlanSelector = ({
  plans,
  selectedPlan,
  setSelectedPlan,
  paymentMethod,
  setPaymentMethod,
  isStarted,
  setIsStarted,
  timeLeft,
  formatTimer,
  loading,
  handleStartPayment,
  isAuthenticated,
  setStatusNotice
}) => {
  return (
    <>
      {/* 1. Tarif tanlash qismi */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              1. Tarif Rejasini Tanlang
            </h3>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Barcha kurslar ochiq</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(plans).map(([key, plan]) => {
            const isSelected = selectedPlan === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedPlan(key);
                  if (isStarted) {
                    setIsStarted(false);
                    if (setStatusNotice) setStatusNotice(null);
                  }
                }}
                className={`p-2 sm:p-2.5 rounded-xl border text-left relative transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30 shadow-sm scale-[1.01]'
                    : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/50 dark:bg-white/[0.02]'
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-2 right-2 bg-brand-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-sm">
                    Tavsiya
                  </span>
                )}
                {plan.superSaver && (
                  <span className="absolute -top-2 right-2 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-sm">
                    Super Tejam
                  </span>
                )}

                <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{plan.name}</p>
                <p className="text-xs sm:text-sm font-black text-brand-600 dark:text-brand-400 mt-0.5">{plan.price}</p>
                <p className="text-[9px] text-gray-400 font-medium truncate mt-0.5">{plan.duration}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. To'lov usulini tanlash (Ilova vs Bankomat) */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <CreditCard className="w-3.5 h-3.5 text-brand-500" />
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            2. To'lov Usulini Tanlang
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Ilova orqali */}
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('apps');
              if (isStarted && paymentMethod !== 'apps') {
                setIsStarted(false);
              }
            }}
            className={`p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
              paymentMethod === 'apps'
                ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/50 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Ilova orqali to'lov</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Tezkor o'tkazma</p>
                <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] text-brand-600 dark:text-brand-400 font-bold">
                  <Clock className="w-2.5 h-2.5 text-brand-500" />
                  30 daqiqa vaqt beriladi
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 mt-1.5 pt-1 border-t border-gray-100 dark:border-white/5">
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-[#00cccc]/10 text-[#008f8f] dark:text-[#00ffff] border border-[#00cccc]/20">
                Payme
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-[#0073ff]/10 text-[#005cd4] dark:text-[#4da3ff] border border-[#0073ff]/20">
                Click
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-[#7b2cbf]/10 text-[#7b2cbf] dark:text-[#c77dff] border border-[#7b2cbf]/20">
                Uzum Bank
              </span>
            </div>
          </button>

          {/* Bankomat orqali */}
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('bankomat');
              if (isStarted && paymentMethod !== 'bankomat') {
                setIsStarted(false);
              }
            }}
            className={`p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
              paymentMethod === 'bankomat'
                ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/50 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Bankomat orqali to'lov</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Naqd pul / Terminal</p>
                <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                  <Clock className="w-2.5 h-2.5 text-amber-500" />
                  1 soat (60 daqiqa) beriladi
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 mt-1.5 pt-1 border-t border-gray-100 dark:border-white/5">
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Terminal
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Naqd Pul
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Paynet / ATM
              </span>
            </div>
          </button>
        </div>

        {/* Tizimga kirmagan bo'lsa ogohlantirish */}
        {!isAuthenticated && (
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-[11px] mt-1.5">
            <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-medium">
              <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>To'lov profilingizga biriktirilishi uchun tizimga kiring:</span>
            </div>
            <Link
              to="/login"
              state={{ returnUrl: `/checkout?plan=${selectedPlan}` }}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
            >
              Kirish
            </Link>
          </div>
        )}

        {/* To'lovni boshlash tugmasi yoki Taymer */}
        {!isStarted ? (
          <button
            type="button"
            onClick={handleStartPayment}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            <span>To'lovni Boshlash va Rekvizitlarni Faollashtirish</span>
          </button>
        ) : (
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-teal-500/10 border border-brand-500/30 flex items-center justify-between mt-1.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center animate-pulse">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">
                  {paymentMethod === 'bankomat' ? 'Bankomat to\'lovi uchun qolgan vaqt:' : 'Chek yuklash uchun qolgan vaqt:'}
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">
                  {paymentMethod === 'bankomat' ? '1 soat (60 daqiqa) limit' : '30 daqiqa limit'} • Taymer tugamasdan chekni yuboring
                </p>
              </div>
            </div>
            <div className={`text-base sm:text-lg font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-bounce' : 'text-brand-600 dark:text-brand-400'}`}>
              {formatTimer(timeLeft)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
