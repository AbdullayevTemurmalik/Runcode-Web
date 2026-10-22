import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CreditCard, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Smartphone, 
  FileCheck,
  ShieldCheck,
  Loader2,
  Tag,
  Percent,
  QrCode,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getStoredPromocode, setStoredPromocode } from '../hooks/useActivePromocode';
import { safeSessionStorage } from '../utils/storage';

const UZUM_PAYMENT_URL = 'https://b.2u.uz/ttc?qr=Nzk5MzoyMDU4NjEzMjowMU00VDA0VlgyNjVYQU1IR1k5SjdNV1ZEODp1OVhXZWtrenRJNmNadm5oZVhXQ1NhOWJOdFk9';
const CLICK_PAYMENT_URL = 'https://my.click.uz/clickp2p/9E9EB6EE67E40DB610877D03FC6AB8BD136BDBF5F386F48C91E40184E1EB9EE7';

export const PaymentModal = ({ isOpen, onClose, initialPlan = '7_days' }) => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotification();

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState('apps'); // 'apps' (Click) or 'uzum'
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Promokod holatlari
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [plans, setPlans] = useState({
    '7_days': { name: 'Test Plus (7 Kunlik)', originalPrice: '25 000 so\'m', originalAmount: 25000, price: '15 000 so\'m', amount: 15000 },
    '1_month': { name: 'Pro (1 Oylik)', originalPrice: '60 000 so\'m', originalAmount: 60000, price: '40 000 so\'m', amount: 40000 },
    '2_months': { name: 'Pro+ (2 Oylik)', originalPrice: '100 000 so\'m', originalAmount: 100000, price: '70 000 so\'m', amount: 70000, recommended: true },
    '3_months': { name: 'Max (3 Oylik)', originalPrice: '140 000 so\'m', originalAmount: 140000, price: '100 000 so\'m', amount: 100000, superSaver: true }
  });

  useEffect(() => {
    if (initialPlan && initialPlan !== 'free') {
      setSelectedPlan(initialPlan);
    }
  }, [initialPlan]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleReset();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Barcha tarif va to'lov ma'lumotlarini to'g'ridan-to'g'ri backenddan olish
  useEffect(() => {
    if (!isOpen) return;
    const fetchBackendConfig = async () => {
      try {
        const res = await api.get('/payments/config');
        if (res.success) {
          if (res.plans) {
            const paidPlans = {};
            for (const [k, v] of Object.entries(res.plans)) {
              if (k !== 'free' && !v.isFree && k !== '6_months') {
                paidPlans[k] = {
                  name: v.name || (k === '3_months' ? 'Max (3 Oylik)' : k === '2_months' ? 'Pro+ (2 Oylik)' : k === '1_month' ? 'Pro (1 Oylik)' : 'Test Plus (7 Kunlik)'),
                  originalPrice: v.originalPrice || (k === '3_months' ? '140 000 so\'m' : k === '2_months' ? '100 000 so\'m' : k === '1_month' ? '60 000 so\'m' : '25 000 so\'m'),
                  originalAmount: v.originalAmount || (k === '3_months' ? 140000 : k === '2_months' ? 100000 : k === '1_month' ? 60000 : 25000),
                  price: v.price || (k === '3_months' ? '100 000 so\'m' : k === '2_months' ? '70 000 so\'m' : k === '1_month' ? '40 000 so\'m' : '15 000 so\'m'),
                  amount: v.amount || (k === '3_months' ? 100000 : k === '2_months' ? 70000 : k === '1_month' ? 40000 : 15000),
                  recommended: k === '2_months',
                  superSaver: k === '3_months'
                };
              }
            }
            if (Object.keys(paidPlans).length > 0) {
              setPlans(paidPlans);
            }
          }
        }
      } catch (err) {
        console.error('To\'lov konfiguratsiyasini yuklashda xatolik:', err);
      }
    };
    fetchBackendConfig();
  }, [isOpen]);

  const handleApplyPromocode = async (codeToUse) => {
    const cleanCode = (codeToUse || promoCodeInput).trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('Iltimos, promokodni kiriting');
      return;
    }
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await api.post('/promocodes/apply', {
        code: cleanCode,
        planName: selectedPlan
      });
      if (res.success && res.promo) {
        const excludedList = Array.isArray(res.promo.excludedPlans) ? res.promo.excludedPlans : [];
        const promoToSave = {
          code: res.promo.code,
          discountPercent: res.promo.discountPercent,
          excludedPlans: excludedList,
          expiresAt: res.promo.expiresAt,
          remainingSeconds: res.promo.remainingSeconds
        };
        setStoredPromocode(promoToSave);
        setAppliedPromo(res.promo);

        if (res.promo.isExcluded) {
          setPromoError('Ushbu promokod tanlangan tarif uchun amal qilmaydi (boshqa tariflar uchun amal qiladi)');
        } else {
          setPromoError('');
        }
      } else {
        setAppliedPromo(null);
        setPromoError(res.message || 'Bunday promokod topilmadi yoki noto\'g\'ri kiritilgan');
      }
    } catch (err) {
      setAppliedPromo(null);
      setPromoError(err.message || 'Bunday promokod topilmadi yoki noto\'g\'ri kiritilgan');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromocode = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
    setStoredPromocode(null);
  };

  const handleSelectPlan = async (key) => {
    setSelectedPlan(key);
    const activeStored = appliedPromo || getStoredPromocode();
    if (activeStored?.code) {
      const isExcluded = Array.isArray(activeStored.excludedPlans) && activeStored.excludedPlans.includes(key);
      if (isExcluded) {
        setPromoError('Ushbu tarif uchun chegirma amal qilmaydi (standart narxda to\'lanadi)');
      } else {
        setPromoError('');
      }
    }
  };

  // Modal ochilganda localStorage dagi promokodni avtomatik yuklash
  useEffect(() => {
    if (!isOpen) return;
    const stored = getStoredPromocode();
    if (stored?.code && !appliedPromo) {
      setPromoCodeInput(stored.code);
      setAppliedPromo(stored);
      if (Array.isArray(stored.excludedPlans) && stored.excludedPlans.includes(selectedPlan)) {
        setPromoError('Ushbu promokod tanlangan tarif uchun amal qilmaydi (boshqa tariflar uchun amal qiladi)');
      }
    }
  }, [isOpen]);

  // 2-Qadamga o'tish va teskari taymerni boshlash (30 daqiqa)
  const handleStartPayment = async () => {
    setError(null);
    setLoading(true);
    try {
      const activeStored = appliedPromo || getStoredPromocode();
      const isPlanExcluded = !!(
        activeStored &&
        Array.isArray(activeStored.excludedPlans) &&
        activeStored.excludedPlans.includes(selectedPlan)
      );

      const res = await api.post('/payments/start', {
        planName: selectedPlan,
        paymentMethod,
        promocode: (!isPlanExcluded && activeStored?.code) ? activeStored.code : undefined
      });
      if (res.success && res.order) {
        setOrder(res.order);
        setTimeLeft(res.order.remainingSeconds || 1800);
        setIsStepTwo(true);
      } else {
        setError(res.message || 'To\'lov so\'rovini yaratishda xatolik');
      }
    } catch (err) {
      setIsStepTwo(true);
      setTimeLeft(1800);
    } finally {
      setLoading(false);
    }
  };

  // Teskari taymer hisoblash
  useEffect(() => {
    if (!isStepTwo || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStepTwo, timeLeft]);

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const [copiedUzumLink, setCopiedUzumLink] = useState(false);
  const [copiedClickLink, setCopiedClickLink] = useState(false);

  const copyUzumLink = () => {
    navigator.clipboard.writeText(UZUM_PAYMENT_URL);
    setCopiedUzumLink(true);
    setTimeout(() => setCopiedUzumLink(false), 2000);
  };

  const copyClickLink = () => {
    navigator.clipboard.writeText(CLICK_PAYMENT_URL);
    setCopiedClickLink(true);
    setTimeout(() => setCopiedClickLink(false), 2000);
  };

  // Tanlangan chek faylini sessiyadan qayta tiklash
  useEffect(() => {
    if (!isOpen) return;
    try {
      const cached = safeSessionStorage.getItem('runcode_modal_receipt_file');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.dataUrl && parsed?.name) {
          const arr = parsed.dataUrl.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || parsed.type || 'image/png';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const restoredFile = new File([u8arr], parsed.name, {
            type: mime,
            lastModified: parsed.lastModified || Date.now()
          });
          setSelectedFile(restoredFile);
          if (mime.startsWith('image/')) {
            setFilePreview(parsed.dataUrl);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Fayl hajmi 10MB dan oshmasligi kerak');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        if (file.type.startsWith('image/')) {
          setFilePreview(dataUrl);
        } else {
          setFilePreview(null);
        }
        try {
          safeSessionStorage.setItem('runcode_modal_receipt_file', JSON.stringify({
            name: file.name,
            type: file.type,
            lastModified: file.lastModified,
            dataUrl
          }));
        } catch (storageErr) {
          // ignore
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    safeSessionStorage.removeItem('runcode_modal_receipt_file');
  };

  const handleUploadReceipt = async () => {
    if (!selectedFile) {
      setError('Iltimos, to\'lov chekining suratini tanlang');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('planName', selectedPlan);
      formData.append('paymentMethod', paymentMethod);
      formData.append('receipt', selectedFile);

      const data = await api.post('/payments/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        setIsSuccess(true);
        safeSessionStorage.removeItem('runcode_modal_receipt_file');
        if (typeof refreshNotifications === 'function') {
          refreshNotifications();
        }
      } else {
        setError(data.message || 'Chekni yuklashda xatolik yuz berdi');
      }
    } catch (err) {
      setError(err.message || 'Chekni yuklashda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsStepTwo(false);
    setOrder(null);
    setSelectedFile(null);
    setFilePreview(null);
    safeSessionStorage.removeItem('runcode_modal_receipt_file');
    setIsSuccess(false);
    setError(null);
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      {/* Dark Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={handleReset}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">RunCode Obunasini Rasmiylashtirish</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tez va xavfsiz to'lov tizimi</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start space-x-3 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                To'lov Cheki Muvaffaqiyatli Yuborildi!
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                Sizning {plans[selectedPlan]?.name} to'lov chekingiz qabul qilindi. Tez orada admin to'lov tushganini tekshirib tasdiqlaydi (odatda 1 soatdan - 2 soatgacha). Tasdiqlangach sizga shaxsiy bildirishnoma boradi va Telegram guruh ochiladi.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-500 transition-colors cursor-pointer"
              >
                Tushunarli, Rahmat
              </button>
            </div>
          ) : !isStepTwo ? (
            /* 1-Qadam: Tarif va to'lov usulini tanlash */
            <div className="space-y-5">
              
              {/* Tarif tanlash */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Obuna muddatini tanlang:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(plans).map(([key, plan]) => {
                    const isSelected = selectedPlan === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPlan(key)}
                        className={`p-2.5 rounded-2xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? key === '3_months'
                              ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30 shadow-md scale-[1.02]'
                              : key === '2_months'
                              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-md scale-[1.02]'
                              : key === '1_month'
                              ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30 shadow-md scale-[1.02]'
                              : 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30 shadow-md scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        {key === '7_days' && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                            TEST PLUS
                          </span>
                        )}
                        {key === '1_month' && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                            PRO
                          </span>
                        )}
                        {(key === '2_months' || plan.recommended) && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                            PRO+ • TAVSIYA
                          </span>
                        )}
                        {key === '3_months' && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                            MAX
                          </span>
                        )}
                        {(() => {
                          const activeStored = appliedPromo || getStoredPromocode();
                          const isPromoExcluded = !!(activeStored && Array.isArray(activeStored.excludedPlans) && activeStored.excludedPlans.includes(key));

                          let currentPlanPrice = plan.price;
                          let showPromoBadge = false;
                          let promoBadgeText = '';

                          if (activeStored && !isPromoExcluded) {
                            const baseAmt = plan.amount || 15000;
                            const discountAmt = Math.round((baseAmt * activeStored.discountPercent) / 100);
                            const calculatedFinal = Math.max(0, baseAmt - discountAmt);
                            currentPlanPrice = `${calculatedFinal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
                            showPromoBadge = true;
                            promoBadgeText = `-${activeStored.discountPercent}% Promo`;
                          }

                          return (
                            <>
                              <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">{plan.name}</p>
                              <div className="flex items-center justify-center gap-1 mt-1">
                                {plan.originalPrice && (
                                  <span className="text-[10px] font-bold line-through text-gray-400">
                                    {plan.originalPrice}
                                  </span>
                                )}
                                <p className={`text-[11px] font-black ${
                                  key === '3_months' ? 'text-purple-600 dark:text-purple-400' :
                                  key === '2_months' ? 'text-emerald-600 dark:text-emerald-400' :
                                  key === '1_month' ? 'text-blue-600 dark:text-blue-400' :
                                  'text-sky-600 dark:text-sky-400'
                                }`}>
                                  {currentPlanPrice}
                                </p>
                              </div>
                              {showPromoBadge && (
                                <span className="inline-block mt-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  {promoBadgeText}
                                </span>
                              )}
                              {activeStored && isPromoExcluded && (
                                <span className="inline-block mt-0.5 px-1 py-0.2 rounded text-[8px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                  Chegirma yo'q
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promokod kiritish bloki */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Tag className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Promokod (Chegirma)</span>
                  </div>
                  {appliedPromo && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Promokod faol
                    </span>
                  )}
                </div>

                {!appliedPromo ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={promoCodeInput}
                          onChange={(e) => {
                            setPromoCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ''));
                            if (promoError) setPromoError('');
                          }}
                          placeholder="RUNCODE2026"
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 uppercase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromocode}
                        disabled={promoLoading || !promoCodeInput.trim()}
                        className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 transition disabled:opacity-50 cursor-pointer flex-shrink-0"
                      >
                        {promoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Tag className="w-3.5 h-3.5" />}
                        <span>Qo'llash</span>
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{promoError}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-300">
                          {appliedPromo.code} (-{appliedPromo.discountPercent}%)
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {appliedPromo.discountAmount?.toLocaleString()} so'm chegirma qo'llandi
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* To'lov usuli tanlash */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To'lov qayerdan amalga oshiriladi?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apps')}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'apps'
                        ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Click Up</p>
                    </div>
                    <p className="text-[10px] text-gray-500 text-left mt-1">Click QR & Ilova (30 daq)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('uzum')}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'uzum'
                        ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Uzum Bank</p>
                    </div>
                    <p className="text-[10px] text-purple-400 text-left mt-1">QR & Ilova (30 daq)</p>
                  </button>
                </div>
              </div>

              {/* Aniq vaqt va ogohlantirish */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start space-x-2.5">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  "To'lovni Boshlash" tugmasini bosganingizdan so'ng rasmiy <strong>QR-kod va ilovada to'lash tugmasi</strong> ochiladi hamda <strong>30 daqiqalik teskari taymer</strong> ishga tushadi. QR-kodni skanerlab yoki ilovada to'lab, chek rasmini yuklashingiz zarur.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>To'lovni Boshlash & Rekvizitlarni Olish</span>
              </button>

            </div>
          ) : (
            /* 2-Qadam: QR-kod to'lov rekvizitlari, faol taymer va Chek yuklash */
            <div className="space-y-5">
              
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={() => setIsStepTwo(false)}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>← Tarif yoki to'lov usulini o'zgartirish</span>
                </button>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  2-qadam: Chek yuklash
                </span>
              </div>

              {/* Faol teskari taymer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-teal-500/10 border border-brand-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center animate-pulse">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Chek yuklash uchun qolgan vaqt:
                    </p>
                    <p className="text-[10px] text-gray-500">
                      30 daqiqa limit • Vaqt tugasa so'rov bekor qilinadi
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-bounce' : 'text-brand-600 dark:text-brand-400'}`}>
                  {formatTimer(timeLeft)}
                </div>
              </div>

              {/* To'lov ma'lumotlari */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
                  <span className="font-semibold">Tanlangan tarif:</span>
                  <span className="font-bold text-xs text-brand-600 dark:text-brand-400">
                    {plans[selectedPlan]?.name || (selectedPlan === '3_months' ? 'Max (3 Oylik)' : selectedPlan === '2_months' ? 'Pro+ (2 Oylik)' : selectedPlan === '1_month' ? 'Pro (1 Oylik)' : 'Test Plus (7 Kunlik)')}
                  </span>
                </div>
                {(() => {
                  const activeStored = appliedPromo || getStoredPromocode();
                  const isPromoExcluded = !!(activeStored && Array.isArray(activeStored.excludedPlans) && activeStored.excludedPlans.includes(selectedPlan));
                  const basePlanAmt = plans[selectedPlan]?.amount || 40000;
                  const discountAmt = (activeStored && !isPromoExcluded) ? Math.round((basePlanAmt * activeStored.discountPercent) / 100) : 0;
                  const finalPlanAmt = Math.max(0, basePlanAmt - discountAmt);
                  const isDiscounted = activeStored && !isPromoExcluded;

                  return (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>To'lov miqdori:</span>
                      <div className="text-right">
                        {isDiscounted && (
                          <span className="text-[10px] line-through text-gray-400 block font-mono">
                            {basePlanAmt.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                          </span>
                        )}
                        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          {finalPlanAmt.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                        </span>
                        {isDiscounted && (
                          <span className="block text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            -{activeStored.discountPercent}% ({activeStored.code})
                          </span>
                        )}
                        {activeStored && isPromoExcluded && (
                          <span className="block text-[9px] font-bold text-amber-500">
                            Chegirma yo'q
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
                
                {paymentMethod === 'uzum' ? (
                  /* Uzum Bank QR & Link Block */
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-gray-900/50 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Uzum Bank QR To'lov</p>
                          <p className="text-[10px] text-purple-400">Rasmiy QR-kod & Ilova</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Tezkor QR
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] aspect-square bg-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-center border-4 border-purple-500/30">
                        <img
                          src="/uzum-qr.png"
                          alt="Uzum Bank QR"
                          className="w-full h-full object-contain select-none"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-purple-300/80 mt-2 text-center">
                        Uzum Bank ilovasida QR-kodni skanerlang yoki to'g'ridan-to'g'ri ilovada to'lang
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={UZUM_PAYMENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Uzum Bank Ilovasida To'lash</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={copyUzumLink}
                        className="py-2.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                        title="To'lov havolasidan nusxa olish"
                      >
                        {copiedUzumLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedUzumLink ? "Nusxalandi!" : "Nusxa"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Click Up QR & Ilova Block */
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-blue-900/20 to-gray-900/50 border border-blue-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#005cd4] to-[#0099ff] text-white flex items-center justify-center shadow-md shadow-blue-900/40">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Click Up QR To'lov</p>
                            <p className="text-[10px] text-blue-400">Rasmiy QR-kod & Ilova</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                          Tezkor QR
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] aspect-square bg-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-center border-4 border-blue-500/30">
                          <img
                            src="/click-qr.png"
                            alt="Click Up QR"
                            className="w-full h-full object-contain select-none"
                          />
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-blue-300/80 mt-2 text-center">
                          Click ilovasida QR-kodni skanerlang yoki to'g'ridan-to'g'ri ilovada to'lang
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={CLICK_PAYMENT_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#005cd4] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Click Ilovasida To'lash</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={copyClickLink}
                          className="py-2.5 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          title="To'lov havolasidan nusxa olish"
                        >
                          {copiedClickLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedClickLink ? "Nusxalandi!" : "Nusxa"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Chek yuklash maydoni */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To'lov chekini yuklang (Rasm yoki PDF):
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4 text-center hover:border-brand-500 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center space-y-2">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Chek preview"
                          className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <FileCheck className="w-10 h-10 text-emerald-500" />
                      )}
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <span className="text-[10px] text-brand-600 dark:text-brand-400">Boshqa fayl tanlash uchun bosing</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 py-3">
                      <UploadCloud className="w-8 h-8 text-gray-400" />
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Chek suratini bu yerga tashlang yoki bosing
                      </p>
                      <p className="text-[10px] text-gray-400">PNG, JPG, JPEG yoki PDF (maksimal 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chekni tasdiqlash uchun yuborish */}
              {selectedFile ? (
                <button
                  type="button"
                  onClick={handleUploadReceipt}
                  disabled={submitting || timeLeft <= 0}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] border-2 border-emerald-400/40"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Chek Adminga Yuborilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-white" />
                      <span>To'lov Chekini Adminga Yuborish (Tasdiqlash)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={true}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gray-100 dark:bg-white/[0.04] text-gray-400 dark:text-gray-500 font-bold text-xs sm:text-sm uppercase tracking-wider border border-gray-200 dark:border-white/5 flex items-center justify-center space-x-2 cursor-not-allowed"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Avval to'lov chekini tanlang (tugma faollashadi)</span>
                </button>
              )}

            </div>
          )}

        </div>

      </div>
      </div>
    </div>,
    document.body
  );
};
