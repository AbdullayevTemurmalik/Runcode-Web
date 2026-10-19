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
  Lock,
  Tag,
  Check,
  Percent,
  QrCode,
  Ban
} from 'lucide-react';
import { safeSessionStorage } from '../../utils/storage';
import api from '../../services/api';
import { getStoredPromocode } from '../../hooks/useActivePromocode';

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
  setStatusNotice,
  appliedPromo,
  setAppliedPromo,
  promoCodeInput,
  setPromoCodeInput,
  promoLoading,
  promoError,
  setPromoError,
  handleApplyPromocode,
  handleRemovePromocode,
  onOpenCancelModal
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
          MAX
        </span>
      );
    }
    if (key === '2_months' || plan?.recommended) {
      return (
        <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
          PRO+ • TAVSIYA
        </span>
      );
    }
    if (key === '1_month') {
      return (
        <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
          PRO
        </span>
      );
    }
    return (
      <span className="bg-sky-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
        TEST PLUS
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

  const handleSelectPlan = async (key) => {
    if (isStarted) {
      if (key !== selectedPlan && setStatusNotice) {
        setStatusNotice(`Siz ayni damda to'lov jarayonidasiz (${plans[selectedPlan]?.name || selectedPlan}). Ushbu to'lov yakunlanmaguncha (tasdiqlanmaguncha yoki rad etilmaguncha), boshqa tarifni tanlay olmaysiz. To'lov tasdiqlangach yangi tarifga qo'shishingiz mumkin.`);
      }
      return;
    }
    setSelectedPlan(key);
    safeSessionStorage.setItem('runcode_checkout_selected_plan', key);
    const activeStored = appliedPromo || getStoredPromocode();
    if (activeStored?.code) {
      const isExcluded = Array.isArray(activeStored.excludedPlans) && activeStored.excludedPlans.includes(key);
      if (isExcluded) {
        if (setPromoError) setPromoError('Ushbu tarif uchun chegirma amal qilmaydi (standart narxda to\'lanadi)');
      } else {
        if (setPromoError) setPromoError('');
      }
    }
  };

  return (
    <>
      {/* 1. Tarif tanlash qismi - 4 ta Reja */}
      <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2">
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
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
            <div className="flex items-start space-x-2.5">
              <Lock className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-black">To'lov jarayoni faol: </span>
                Siz ayni damda <strong className="font-bold underline">{plans[selectedPlan]?.name || selectedPlan}</strong> tarifi uchun to'lov qilyapsiz. Ushbu to'lov yakunlanmaguncha, boshqa tarifni tanlay olmaysiz.
              </div>
            </div>
            {onOpenCancelModal && (
              <button
                type="button"
                onClick={onOpenCancelModal}
                className="self-end sm:self-center flex-shrink-0 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Bekor qilish</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {Object.entries(plans).map(([key, plan]) => {
            const isSelected = selectedPlan === key;
            const isLocked = isStarted && !isSelected;
            const activeStored = appliedPromo || getStoredPromocode();
            const isPromoExcluded = !!(activeStored && Array.isArray(activeStored.excludedPlans) && activeStored.excludedPlans.includes(key));

            let currentPlanPrice = plan.price;
            let showPromoBadge = false;
            let promoBadgeText = '';

            if (activeStored && !isPromoExcluded) {
              const baseAmt = plan.amount || 20000;
              const discountAmt = Math.round((baseAmt * activeStored.discountPercent) / 100);
              const calculatedFinal = Math.max(0, baseAmt - discountAmt);
              currentPlanPrice = `${calculatedFinal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
              showPromoBadge = true;
              promoBadgeText = `-${activeStored.discountPercent}% Promo`;
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPlan(key)}
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
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    {plan.originalPrice && (
                      <span className="text-[10px] sm:text-xs font-bold line-through text-gray-400 dark:text-gray-500">
                        {plan.originalPrice}
                      </span>
                    )}
                    <p className={`text-xs sm:text-sm font-black ${getPlanPriceColor(key)}`}>
                      {currentPlanPrice}
                    </p>
                  </div>
                  {showPromoBadge && (
                    <div className="mt-0.5">
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {promoBadgeText}
                      </span>
                    </div>
                  )}
                  {activeStored && isPromoExcluded && (
                    <div className="mt-0.5">
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        Chegirma yo'q
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">{plan.duration}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Promokod kiritish va qo'llash bloki */}
      <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-brand-500" />
            <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Promokod (Chegirma)
            </h3>
          </div>
          {appliedPromo && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Promokod faollashtirildi
            </span>
          )}
        </div>

        {!appliedPromo ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (handleApplyPromocode) handleApplyPromocode();
            }}
            className="space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  disabled={isStarted}
                  value={promoCodeInput || ''}
                  onChange={(e) => {
                    if (setPromoCodeInput) {
                      setPromoCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                    }
                    if (promoError && setPromoError) setPromoError('');
                  }}
                  placeholder="Promokodni kiriting (masalan: RUNCODE2026)"
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 uppercase disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={promoLoading || isStarted || !promoCodeInput?.trim()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 transition shadow-sm disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                {promoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Tag className="w-3.5 h-3.5" />
                )}
                <span>Qo'llash</span>
              </button>
            </div>

            {promoError && (
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{promoError}</span>
              </div>
            )}
          </form>
        ) : (
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-brand-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                    {appliedPromo.code}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-500 text-white">
                    -{appliedPromo.discountPercent}% Chegirma
                  </span>
                </div>
                {(() => {
                  const currentPlanObj = plans[selectedPlan] || {};
                  const planBaseAmt = currentPlanObj.amount || 20000;
                  const isCurrentExcluded = Array.isArray(appliedPromo.excludedPlans) && appliedPromo.excludedPlans.includes(selectedPlan);
                  const calculatedDiscount = isCurrentExcluded ? 0 : Math.round((planBaseAmt * appliedPromo.discountPercent) / 100);
                  const calculatedFinal = isCurrentExcluded ? planBaseAmt : Math.max(0, planBaseAmt - calculatedDiscount);

                  return isCurrentExcluded ? (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5 truncate">
                      Ushbu tarifda chegirma yo'q • Yakuniy to'lov: <strong className="font-black text-gray-900 dark:text-white font-mono">{calculatedFinal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm</strong>
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 truncate">
                      {calculatedDiscount.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm tejaldi • Yakuniy to'lov: <strong className="font-black text-gray-900 dark:text-white font-mono">{calculatedFinal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm</strong>
                    </p>
                  );
                })()}
              </div>
            </div>
            {!isStarted && handleRemovePromocode && (
              <button
                type="button"
                onClick={handleRemovePromocode}
                className="text-xs font-bold text-gray-400 hover:text-rose-500 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                title="Promokodni bekor qilish"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. To'lov usulini tanlash (Ilova vs Uzum Bank vs Bankomat) */}
      <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-brand-500" />
          <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            2. To'lov Usulini Tanlang
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1. Click orqali */}
          <button
            type="button"
            onClick={() => {
              if (isStarted) return;
              setPaymentMethod('apps');
              safeSessionStorage.setItem('runcode_checkout_payment_method', 'apps');
            }}
            disabled={isStarted && paymentMethod !== 'apps' && paymentMethod !== 'click'}
            className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
              isStarted && paymentMethod !== 'apps' && paymentMethod !== 'click' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            } ${
              paymentMethod === 'apps' || paymentMethod === 'click'
                ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/60 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">Click orqali</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">QR-kod & To'lov Havolasi</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[9.5px] text-blue-600 dark:text-blue-400 font-bold">
                  <Clock className="w-3 h-3 text-blue-500" />
                  30 daqiqa vaqt
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 mt-2 pt-1.5 border-t border-gray-100 dark:border-white/5">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#0073ff]/15 text-[#005cd4] dark:text-[#4da3ff] border border-[#0073ff]/25">
                Click Up
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                QR To'lov
              </span>
            </div>
          </button>

          {/* 2. Uzum Bank orqali */}
          <button
            type="button"
            onClick={() => {
              if (isStarted) return;
              setPaymentMethod('uzum');
              safeSessionStorage.setItem('runcode_checkout_payment_method', 'uzum');
            }}
            disabled={isStarted && paymentMethod !== 'uzum'}
            className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all ${
              isStarted && paymentMethod !== 'uzum' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            } ${
              paymentMethod === 'uzum'
                ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20 shadow-md shadow-purple-500/10'
                : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/60 dark:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-tight">Uzum Bank</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">QR-kod & Ilova</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[9.5px] text-purple-600 dark:text-purple-400 font-bold">
                  <Clock className="w-3 h-3 text-purple-500" />
                  30 daqiqa vaqt
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 mt-2 pt-1.5 border-t border-gray-100 dark:border-white/5">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-[#7b2cbf]/10 text-[#7b2cbf] dark:text-[#c77dff] border border-[#7b2cbf]/20">
                Uzum Bank
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                QR To'lov
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
          <div className="pt-1 flex flex-col space-y-1.5">
            <button
              type="button"
              onClick={handleInitiateClick}
              disabled={loading}
              className="w-full py-3 sm:py-3.5 px-3 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:via-teal-500 hover:to-brand-500 active:scale-[0.99] text-white font-black text-xs sm:text-sm tracking-wide sm:tracking-wider shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin flex-shrink-0" />
              ) : (
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-center leading-snug">
                To'lovni Boshlash va Rekvizitlarni Faollashtirish
              </span>
            </button>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">
              Tugmani bosganingizdan so'ng to'lov rekvizitlari ochiladi va teskari taymer ishga tushadi
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-teal-500/10 border border-brand-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center animate-pulse flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    Chek yuklash uchun qolgan vaqt:
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    30 daqiqa limit • Taymer tugamasdan chekni yuboring
                  </p>
                </div>
              </div>
              <div className={`text-lg sm:text-2xl font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-bounce' : 'text-brand-600 dark:text-brand-400'}`}>
                {formatTimer(timeLeft)}
              </div>
            </div>

            {onOpenCancelModal && (
              <button
                type="button"
                onClick={onOpenCancelModal}
                className="w-full py-2.5 px-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Ban className="w-4 h-4 flex-shrink-0" />
                <span>To'lovni / Buyurtmani Bekor Qilish</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* To'lov usulini tasdiqlash va muhim ogohlantirish modali */}
      {showConfirmModal && (() => {
        const currentPlanObj = plans[selectedPlan] || {};
        const planBaseAmt = currentPlanObj.amount || 20000;
        const isCurrentExcluded = Array.isArray(appliedPromo?.excludedPlans) && appliedPromo?.excludedPlans.includes(selectedPlan);
        const calculatedDiscount = (!appliedPromo || isCurrentExcluded) ? 0 : Math.round((planBaseAmt * appliedPromo.discountPercent) / 100);
        const calculatedFinal = isCurrentExcluded || !appliedPromo ? planBaseAmt : Math.max(0, planBaseAmt - calculatedDiscount);
        const formattedFinalPrice = `${calculatedFinal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
        const isUzumSelected = paymentMethod === 'uzum';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
              
              {/* Yopish tugmasi */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Yopish"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Ogohlantirish Iconi */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center justify-center mb-3 shadow-md shadow-amber-500/10">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1">
                  To'lov Shartlari va Muhim Ogohlantirish
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3.5">
                  Tarifingiz muvaffaqiyatli faollashishi uchun quyidagi qoidalarga qat'iy rioya qiling
                </p>

                {/* Tanlangan To'lov Usuli va Summa Bloki */}
                <div className="w-full p-3 sm:p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10 mb-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                      isUzumSelected 
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                    }`}>
                      {isUzumSelected ? 'Uzum Bank (QR & Ilova)' : 'Click Up (QR & To\'lov Havolasi)'}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {currentPlanObj.name || selectedPlan}
                    </span>
                  </div>

                  <div className="text-right flex items-baseline gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Summa:</span>
                    <span className="text-base sm:text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {formattedFinalPrice}
                    </span>
                  </div>
                </div>

                {/* 3 TA QAT'IY TALAB VA OGOHLANTIRISH QUTILARI */}
                <div className="w-full space-y-2.5 text-left mb-5">
                  
                  {/* 1. To'lov to'liq bo'lishi shart */}
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 shadow-sm">
                      1
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-black text-rose-700 dark:text-rose-300 leading-snug">
                        To'lov to'liq bo'lmasa qabul qilinmaydi!
                      </p>
                      <p className="text-[11px] sm:text-xs text-rose-800/90 dark:text-rose-200/90 mt-0.5 leading-relaxed">
                        Belgilangan to'lov summasi <strong>{formattedFinalPrice}</strong> to'liq o'tkazilishi shart. Agar hatto 1 000 yoki 2 000 so'm kam to'lansa ham (masalan, 50 000 o'rniga 49 000 yoki 48 000 so'm), to'lov tizim tomonidan <strong>qabul qilinmaydi</strong> va rad etiladi.
                      </p>
                    </div>
                  </div>

                  {/* 2. Chek yuklash qat'iyan majburiy */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 shadow-sm">
                      2
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-black text-amber-800 dark:text-amber-300 leading-snug">
                        To'lov chekini yuklash qat'iyan majburiy!
                      </p>
                      <p className="text-[11px] sm:text-xs text-amber-900/90 dark:text-amber-200/90 mt-0.5 leading-relaxed">
                        To'lovni amalga oshirgach, to'lov kvitansiyasini (chek skrinshotini) ushbu sahifadagi 3-bosqichda yuklab tizimga yuborish shart. Cheksiz to'lovlar tekshirilmaydi va profil faollashtirilmaydi.
                      </p>
                    </div>
                  </div>

                  {/* 3. 30 daqiqa vaqt limiti */}
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-start space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5 shadow-sm">
                      3
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-black text-blue-700 dark:text-blue-300 leading-snug">
                        Chek yuklash uchun 30 daqiqa vaqt ajratiladi
                      </p>
                      <p className="text-[11px] sm:text-xs text-blue-800/90 dark:text-blue-200/90 mt-0.5 leading-relaxed">
                        Tasdiqlaganingizdan so'ng to'lov QR-kodi hamda to'g'ridan-to'g'ri ilova havolasi ochiladi. 30 daqiqalik taymer tugashidan oldin chekni yuklash talab etiladi.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Harakat tugmalari */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmStart}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    Tushundim, Boshlash
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};
