import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, AlertCircle, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { CheckoutSuccessView } from '../components/checkout/CheckoutSuccessView';
import { CheckoutPlanSelector } from '../components/checkout/CheckoutPlanSelector';
import { CheckoutReceiptDropzone } from '../components/checkout/CheckoutReceiptDropzone';
import { CheckoutCardPreview } from '../components/checkout/CheckoutCardPreview';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { refreshNotifications } = useNotification();

  const planParam = searchParams.get('plan') || '7_days';

  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [paymentMethod, setPaymentMethod] = useState('apps'); // 'apps' | 'bankomat'
  const [isStarted, setIsStarted] = useState(false);
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [statusNotice, setStatusNotice] = useState(null);

  // Promokod holatlari
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [plans, setPlans] = useState({
    '7_days': { name: 'Plus (7 Kunlik)', originalPrice: '30 000 so\'m', originalAmount: 30000, price: '20 000 so\'m', amount: 20000, duration: '7 kun to\'liq ochiq' },
    '1_month': { name: 'Pro (1 Oylik)', originalPrice: '75 000 so\'m', originalAmount: 75000, price: '50 000 so\'m', amount: 50000, duration: '1 oy to\'liq ochiq' },
    '2_months': { name: 'Pro+ (2 Oylik)', originalPrice: '125 000 so\'m', originalAmount: 125000, price: '90 000 so\'m', amount: 90000, duration: '2 oy to\'liq ochiq', recommended: true },
    '3_months': { name: 'Ultra (3 Oylik)', originalPrice: '150 000 so\'m', originalAmount: 150000, price: '120 000 so\'m', amount: 120000, duration: '3 oy to\'liq ochiq', superSaver: true }
  });

  const [cardInfo, setCardInfo] = useState({
    number: '9860 3501 4972 8288',
    rawNumber: '9860350149728288',
    holder: 'TEMURMALIK ABDULLAYEV',
    phone: '+998 90 696 79 99',
    rawPhone: '+998906967999',
    bank: 'HUMO'
  });

  // URL query o'zgarsa rejani yangilash
  useEffect(() => {
    if (isStarted && (order?.plan_name || order?.planName)) {
      setSelectedPlan(order.plan_name || order.planName);
      return;
    }
    if (planParam && plans[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [planParam, isStarted, order]);

  // Backend konfiguratsiyasi va faol buyurtmani tekshirish
  useEffect(() => {
    const fetchConfigAndActiveOrder = async () => {
      try {
        const configRes = await api.get('/payments/config');
        if (configRes && configRes.success) {
          if (configRes.plans) {
            const paid = {};
            for (const [k, v] of Object.entries(configRes.plans)) {
              if (k !== 'free' && !v.isFree && k !== '6_months') {
                paid[k] = {
                  name: v.name || (k === '3_months' ? 'Ultra (3 Oylik)' : k === '2_months' ? 'Pro+ (2 Oylik)' : k === '1_month' ? 'Pro (1 Oylik)' : 'Plus (7 Kunlik)'),
                  originalPrice: v.originalPrice || (k === '3_months' ? '150 000 so\'m' : k === '2_months' ? '125 000 so\'m' : k === '1_month' ? '75 000 so\'m' : '30 000 so\'m'),
                  originalAmount: v.originalAmount || (k === '3_months' ? 150000 : k === '2_months' ? 125000 : k === '1_month' ? 75000 : 30000),
                  price: v.price || (k === '3_months' ? '120 000 so\'m' : k === '2_months' ? '90 000 so\'m' : k === '1_month' ? '50 000 so\'m' : '20 000 so\'m'),
                  amount: v.amount || (k === '3_months' ? 120000 : k === '2_months' ? 90000 : k === '1_month' ? 50000 : 20000),
                  duration: v.duration || (k === '3_months' ? '3 oy to\'liq' : k === '2_months' ? '2 oy to\'liq' : k === '1_month' ? '1 oy to\'liq' : '7 kun to\'liq'),
                  recommended: k === '2_months',
                  superSaver: k === '3_months'
                };
              }
            }
            if (Object.keys(paid).length > 0) {
              setPlans(paid);
            }
          }
          if (configRes.cardDetails) {
            setCardInfo({
              number: configRes.cardDetails.cardNumber || '9860 3501 4972 8288',
              rawNumber: configRes.cardDetails.cardRawNumber || '9860350149728288',
              holder: (configRes.cardDetails.cardHolder || 'TEMURMALIK ABDULLAYEV').toUpperCase(),
              phone: configRes.cardDetails.phone || '+998 90 696 79 99',
              rawPhone: configRes.cardDetails.rawPhone || '+998906967999',
              bank: configRes.cardDetails.bank || 'HUMO'
            });
          }
        }

        // Agar tizimga kirgan bo'lsa, oldingi faol to'lov buyurtmasi mavjudligini tekshiramiz
        if (isAuthenticated) {
          const activeRes = await api.get('/payments/active-order');
          if (activeRes && activeRes.success && activeRes.activeOrder) {
            const active = activeRes.activeOrder;
            setOrder(active);
            setSelectedPlan(active.planName || '7_days');
            setPaymentMethod(active.paymentMethod || 'apps');
            
            if (active.appliedPromocode) {
              setAppliedPromo({
                code: active.appliedPromocode,
                discountPercent: active.discountPercent || 0,
                finalAmount: active.finalAmount || active.amount,
                baseAmount: active.baseAmount || active.amount
              });
            }

            if (active.hasReceipt) {
              setIsSuccess(true);
              setStatusNotice('Sizning to\'lov chekingiz admin tomonidan tekshirilmoqda. Ushbu to\'lov yakunlanmaguncha (tasdiqlanmaguncha yoki rad etilmaguncha), yangi to\'lov qila olmaysiz.');
            } else {
              setTimeLeft(active.remainingSeconds || 0);
              setIsStarted(true);
              setStatusNotice(`Siz ayni damda to'lov jarayonidasiz. Ushbu to'lov yakunlanmaguncha boshqa tarifni tanlay olmaysiz.`);
            }
          }
        }
      } catch (err) {
        console.error('To\'lov ma\'lumotlarini yuklashda xatolik:', err);
      }
    };

    fetchConfigAndActiveOrder();
  }, [isAuthenticated]);

  // Teskari taymer
  useEffect(() => {
    if (!isStarted || timeLeft <= 0) return;

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
  }, [isStarted, timeLeft]);

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardInfo.rawNumber);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(cardInfo.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleApplyPromocode = async (codeToApply) => {
    const cleanCode = (codeToApply || promoCodeInput).trim().toUpperCase();
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
        setAppliedPromo(res.promo);
        setPromoError('');
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
  };

  const handleStartPayment = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/checkout?plan=${selectedPlan}` } });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/payments/start', {
        planName: selectedPlan,
        paymentMethod,
        promocode: appliedPromo?.code || undefined
      });

      if (res.success && res.order) {
        setOrder(res.order);
        setTimeLeft(res.order.remainingSeconds || (paymentMethod === 'bankomat' ? 3600 : 1800));
        setIsStarted(true);
        if (res.isExisting) {
          setStatusNotice('Oldingi faol to\'lov so\'rovingiz qayta tiklandi.');
        } else {
          setStatusNotice(null);
        }
      } else {
        setError(res.message || 'To\'lov so\'rovini yaratishda xatolik');
      }
    } catch (err) {
      setError(err.message || 'To\'lov tizimiga ulanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUploadReceipt = async () => {
    if (!selectedFile) {
      setError('Iltimos, to\'lov chekining suratini yoki PDF faylini tanlang.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      if (order && order.id) {
        formData.append('orderId', order.id);
      }
      formData.append('planName', selectedPlan);
      formData.append('paymentMethod', paymentMethod);
      formData.append('receipt', selectedFile);

      const res = await api.post('/payments/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success) {
        setIsSuccess(true);
        if (typeof refreshNotifications === 'function') {
          refreshNotifications();
        }
      } else {
        setError(res.message || 'Chekni yuklashda xatolik yuz berdi.');
      }
    } catch (err) {
      setError(err.message || 'Chekni yuklashda xatolik yuz berdi.');
    } finally {
      setSubmitting(false);
    }
  };

  const basePlanObj = plans[selectedPlan] || plans['7_days'] || plans['1_month'] || {};
  const activePlanObj = {
    ...basePlanObj,
    originalPrice: basePlanObj.originalPrice || basePlanObj.price,
    originalAmount: basePlanObj.originalAmount || basePlanObj.amount,
    ...(appliedPromo ? {
      basePrice: basePlanObj.price,
      baseAmount: basePlanObj.amount,
      price: `${appliedPromo.finalAmount?.toLocaleString()} so'm`,
      amount: appliedPromo.finalAmount,
      appliedPromo
    } : {})
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-gray-50 dark:bg-[#070a12] p-2.5 sm:p-3.5 lg:p-4 transition-colors overflow-y-auto lg:overflow-hidden select-none">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0 space-y-2.5 sm:space-y-3">
        
        {/* Yuqori navigatsiya paneli */}
        <div className="flex items-center justify-between flex-shrink-0 pt-0.5">
          <Link
            to="/tariffs"
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tariflarga qaytish</span>
          </Link>

          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit Xavfsiz To'lov Kanali</span>
          </div>
        </div>

        {/* Ogohlantirishlar va Xatoliklar */}
        {error && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="leading-tight font-medium truncate">{error}</p>
          </div>
        )}

        {statusNotice && !error && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in flex-shrink-0">
            <Info className="w-4 h-4 flex-shrink-0" />
            <p className="leading-tight font-medium truncate">{statusNotice}</p>
          </div>
        )}

        {isSuccess ? (
          <CheckoutSuccessView activePlanObj={activePlanObj} cardInfo={cardInfo} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 xl:gap-5 items-start flex-1 min-h-0">
            {/* CHAP USTUN: Reja tanlash, To'lov turi va Chek yuklash (7 ustun) */}
            <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5 min-h-0">
              <CheckoutPlanSelector
                plans={plans}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                isStarted={isStarted}
                setIsStarted={setIsStarted}
                timeLeft={timeLeft}
                formatTimer={formatTimer}
                loading={loading}
                handleStartPayment={handleStartPayment}
                isAuthenticated={isAuthenticated}
                setStatusNotice={setStatusNotice}
                appliedPromo={appliedPromo}
                setAppliedPromo={setAppliedPromo}
                promoCodeInput={promoCodeInput}
                setPromoCodeInput={setPromoCodeInput}
                promoLoading={promoLoading}
                promoError={promoError}
                setPromoError={setPromoError}
                handleApplyPromocode={handleApplyPromocode}
                handleRemovePromocode={handleRemovePromocode}
              />
              <CheckoutReceiptDropzone
                selectedFile={selectedFile}
                filePreview={filePreview}
                handleFileChange={handleFileChange}
                handleUploadReceipt={handleUploadReceipt}
                submitting={submitting}
                isStarted={isStarted}
                timeLeft={timeLeft}
              />
            </div>

            {/* O'NG USTUN: Realistik Zumrad HUMO Kartasi va 4 Qoida (5 ustun) */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-3.5 min-h-0">
              <CheckoutCardPreview
                cardInfo={cardInfo}
                activePlanObj={activePlanObj}
                paymentMethod={paymentMethod}
                copiedCard={copiedCard}
                copyCardNumber={copyCardNumber}
                copiedPhone={copiedPhone}
                copyPhoneNumber={copyPhoneNumber}
                appliedPromo={appliedPromo}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
