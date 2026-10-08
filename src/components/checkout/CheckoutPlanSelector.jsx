import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Clock, 
  Info, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleInitiateClick = () => {
    if (!isAuthenticated) {
      handleStartPayment();
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmStart = () => {
    setShowConfirmModal(false);
    handleStartPayment();
  };
  const getPlanBadge = (key, plan) => {
    if (key === '3_months' || plan?.superSaver) {
      return (
        <span className="bg-purple-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
          Super Tejam
        </span>
      );
    }
    if (key === '2_months' || plan?.recommended) {
      return (
        <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
          Tavsiya
        </span>
      );
    }
    if (key === '1_month') {
      return (
        <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
          Pro
        </span>
      );
    }
    return (
      <span className="bg-sky-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
        Test Sinov
      </span>
    );
  };

  const getPlanSelectedStyle = (key) => {
    switch (key) {
      case '3_months':
        return 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30 dark:bg-purple-500/10';
      case '2_months':
        return 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 dark:bg-emerald-500/10';
      case '1_month':
        return 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30 dark:bg-blue-500/10';
      case '7_days':
      default:
        return 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30 dark:bg-sky-500/10';
    }
  };

  const getPlanPriceColor = (key) => {
    switch (key) {
      case '3_months':
        return 'text-purple-600 dark:text-purple-400';
      case '2_months':
        return 'text-emerald-600 dark:text-emerald-400';
      case '1_month':
        return 'text-blue-600 dark:text-blue-400';
      case '7_days':
      default:
        return 'text-sky-600 dark:text-sky-400';
    }
  };

  return (
    <>
      {/* 1. Tarif tanlash qismi - 4 ta Reja */}
      <div className="p-3 sm:p-3.5 rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              1. Tarif Rejasini Tanlang
            </h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Barcha 4 kurs ochiq</span>
        </div>

        {/* Faol to'lov jarayoni ogohlantirish banneri */}
        {isStarted && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-2.5 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
            <Lock className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-black">To'lov jarayoni faol: </span>
              Siz ayni damda <strong className="font-bold underline">{plans[selectedPlan]?.name || selectedPlan}</strong> tarifi uchun to'lov qilyapsiz. Ushbu to'lov yakunlanmaguncha (tasdiqlanmaguncha yoki rad etilmaguncha), boshqa tarifni tanlay olmaysiz. To'lov tasdiqlangach yangi tarifga qo'shishingiz mumkin.
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {Object.entries(plans).map(([key, plan]) => {
            const isSelected = selectedPlan === key;
            const isLocked = isStarted && !isSelected;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (isStarted) {
                    if (key !== selectedPlan && setStatusNotice) {
                      setStatusNotice(`Siz ayni damda to'lov jarayonidasiz (${plans[selectedPlan]?.name || selectedPlan}). Ushbu to'lov yakunlanmaguncha (tasdiqlanmaguncha yoki rad etilmaguncha), boshqa tarifni tanlay olmaysiz. To'lov tasdiqlangach yangi tarifga qo'shishingiz mumkin.`);
                    }
                    return;
                  }
                  setSelectedPlan(key);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 text-left relative transition-all duration-150 flex flex-col justify-between ${
                  isLocked
                    ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.01]'
                    : isSelected
                    ? `${getPlanSelectedStyle(key)} shadow-sm scale-[1.01] cursor-pointer`
                    : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/60 dark:bg-white/[0.02] cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  {getPlanBadge(key, plan)}
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <Lock className="w-3 h-3" />
                      Qulflangan
                    </span>
                  )}
                  {isSelected && (
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                      key === '3_months' ? 'text-purple-500' :
                      key === '2_months' ? 'text-emerald-500' :
                      key === '1_month' ? 'text-blue-500' :
                      'text-sky-500'
                    }`} />
                  )}
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">{plan.name}</p>
                  <p className={`text-sm sm:text-base font-black mt-0.5 ${getPlanPriceColor(key)}`}>{plan.price}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">{plan.duration}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. To'lov usulini tanlash (Ilova vs Bankomat) */}
      <div className="p-3 sm:p-3.5 rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2.5">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-brand-500" />
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            2. To'lov Usulini Tanlang
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Ilova orqali */}
          <button
            type="button"
            onClick={() => {
              if (isStarted) return;
              setPaymentMethod('apps');
            }}
            disabled={isStarted && paymentMethod !== 'apps'}
            className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
              isStarted && paymentMethod !== 'apps' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            } ${
              paymentMethod === 'apps'
                ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20 shadow-sm'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/60 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">Ilova orqali to'lov</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Tezkor mobil o'tkazma</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                  <Clock className="w-3 h-3 text-brand-500" />
                  30 daqiqa vaqt beriladi
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 mt-2 pt-1.5 border-t border-gray-100 dark:border-white/5">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#00cccc]/10 text-[#008f8f] dark:text-[#00ffff] border border-[#00cccc]/20">
                Payme
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#0073ff]/10 text-[#005cd4] dark:text-[#4da3ff] border border-[#0073ff]/20">
                Click
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-[#7b2cbf]/10 text-[#7b2cbf] dark:text-[#c77dff] border border-[#7b2cbf]/20">
                Uzum Bank
              </span>
            </div>
          </button>

          {/* Bankomat orqali */}
          <button
            type="button"
            onClick={() => {
              if (isStarted) return;
              setPaymentMethod('bankomat');
            }}
            disabled={isStarted && paymentMethod !== 'bankomat'}
            className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
              isStarted && paymentMethod !== 'bankomat' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            } ${
              paymentMethod === 'bankomat'
                ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20 shadow-sm'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/60 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">Bankomat orqali to'lov</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Naqd pul / Terminal</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  <Clock className="w-3 h-3 text-amber-500" />
                  1 soat (60 daqiqa) beriladi
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 mt-2 pt-1.5 border-t border-gray-100 dark:border-white/5">
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Terminal
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Naqd Pul
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Paynet / ATM
              </span>
            </div>
          </button>
        </div>

        {/* Tizimga kirmagan bo'lsa ogohlantirish */}
        {!isAuthenticated && (
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-medium">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>To'lov profilingizga biriktirilishi uchun tizimga kiring:</span>
            </div>
            <Link
              to="/login"
              state={{ returnUrl: `/checkout?plan=${selectedPlan}` }}
              className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Kirish
            </Link>
          </div>
        )}

        {/* To'lovni boshlash tugmasi yoki Taymer */}
        {!isStarted ? (
          <button
            type="button"
            onClick={handleInitiateClick}
            disabled={loading}
            className="w-full py-3 sm:py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            <span>To'lovni Boshlash va Rekvizitlarni Faollashtirish</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-teal-500/10 border border-brand-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center animate-pulse flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {paymentMethod === 'bankomat' ? 'Bankomat to\'lovi uchun qolgan vaqt:' : 'Chek yuklash uchun qolgan vaqt:'}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {paymentMethod === 'bankomat' ? '1 soat (60 daqiqa) limit' : '30 daqiqa limit'} • Taymer tugamasdan chekni yuboring
                </p>
              </div>
            </div>
            <div className={`text-lg sm:text-2xl font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-bounce' : 'text-brand-600 dark:text-brand-400'}`}>
              {formatTimer(timeLeft)}
            </div>
          </div>
        )}
      </div>

      {/* To'lov usulini tasdiqlash modali */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 relative">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                To'lov Usulini Tasdiqlash
              </h3>

              <div className="my-3 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/25">
                <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {paymentMethod === 'bankomat' ? 'BANKOMAT ORQALI TO\'LASH' : 'ILOVADAN TO\'LASH'}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                Siz <span className="font-bold text-rose-600 dark:text-rose-400">{paymentMethod === 'bankomat' ? "BANKOMAT ORQALI TO'LASH" : "ILOVADAN TO'LASH"}</span> metodini tanladingiz. Aynan shu usulda pul to'lamoqchimisiz?
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
                {paymentMethod === 'bankomat'
                  ? "Tasdiqlaganingizdan so'ng hisob rekvizitlari ochiladi va chek yuklash uchun 1 soat (60 daqiqa) vaqt beriladi."
                  : "Tasdiqlaganingizdan so'ng hisob rekvizitlari ochiladi va chek yuklash uchun 30 daqiqa vaqt beriladi."}
              </p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStart}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all cursor-pointer"
                >
                  Ha, tasdiqlayman
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
