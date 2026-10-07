import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Smartphone, 
  Building2, 
  FileCheck, 
  ShieldCheck, 
  Loader2, 
  Phone, 
  UserCheck, 
  ArrowLeft,
  Sparkles,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { refreshNotifications } = useNotification();

  const planParam = searchParams.get('plan') || '1_month';

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

  const [plans, setPlans] = useState({
    '1_month': { name: 'Plus (1 Oylik)', price: '50 000 so\'m', amount: 50000, duration: '1 oy to\'liq ochiq' },
    '2_months': { name: 'Pro (2 Oylik)', price: '90 000 so\'m', amount: 90000, duration: '2 oy to\'liq ochiq', recommended: true },
    '3_months': { name: 'Ultra (3 Oylik)', price: '120 000 so\'m', amount: 120000, duration: '3 oy to\'liq ochiq', superSaver: true }
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
    if (planParam && plans[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  // Backend konfiguratsiyasi va faol buyurtmani tekshirish
  useEffect(() => {
    const fetchConfigAndActiveOrder = async () => {
      try {
        const configRes = await api.get('/payments/config');
        if (configRes && configRes.success) {
          if (configRes.plans) {
            const paid = {};
            for (const [k, v] of Object.entries(configRes.plans)) {
              if (k !== 'free' && !v.isFree) {
                paid[k] = {
                  name: k === '3_months' ? 'Ultra (3 Oylik)' : k === '2_months' ? 'Pro (2 Oylik)' : 'Plus (1 Oylik)',
                  price: v.price || (k === '3_months' ? '120 000 so\'m' : k === '2_months' ? '90 000 so\'m' : '50 000 so\'m'),
                  amount: v.amount || (k === '3_months' ? 120000 : k === '2_months' ? 90000 : 50000),
                  duration: v.duration || (k === '3_months' ? '3 oy to\'liq' : k === '2_months' ? '2 oy to\'liq' : '1 oy to\'liq'),
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
            setSelectedPlan(active.planName || '1_month');
            setPaymentMethod(active.paymentMethod || 'apps');
            setTimeLeft(active.remainingSeconds || 0);
            setIsStarted(true);
            setStatusNotice('Sizda avvaldan faollashtirilgan to\'lov so\'rovi mavjud. Belgilangan vaqt ichida chek suratini yuklang.');
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
        paymentMethod
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

  const activePlanObj = plans[selectedPlan] || plans['1_month'];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-gray-50 dark:bg-[#070a12] p-2 sm:p-3 lg:p-3.5 transition-colors overflow-y-auto lg:overflow-hidden select-none">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between min-h-0 space-y-2 lg:space-y-2.5">
        
        {/* Yuqori navigatsiya paneli */}
        <div className="flex items-center justify-between flex-shrink-0 pt-0.5">
          <Link
            to="/tariffs"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tariflarga qaytish</span>
          </Link>

          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit Xavfsiz To'lov Kanali</span>
          </div>
        </div>

        {/* Ogohlantirishlar va Xatoliklar */}
        {error && (
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center space-x-2 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="leading-tight font-medium truncate">{error}</p>
          </div>
        )}

        {statusNotice && !error && (
          <div className="p-2 sm:p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs flex items-center space-x-2 animate-in fade-in flex-shrink-0">
            <Info className="w-4 h-4 flex-shrink-0" />
            <p className="leading-tight font-medium truncate">{statusNotice}</p>
          </div>
        )}

        {isSuccess ? (
          /* Muvaffaqiyat holati */
          <div className="max-w-md mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                To'lov Cheki Qabul Qilindi!
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                Sizning <strong className="text-gray-900 dark:text-white font-bold">{activePlanObj.name}</strong> to'lov chekingiz admin tekshiruviga yuborildi. 
                Odatda 1 soatdan - 2 soatgacha tekshirilib tasdiqlanadi va profilingizda status faollashadi.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Tarif:</span>
                <span className="font-bold text-gray-900 dark:text-white">{activePlanObj.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">To'lov miqdori:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{activePlanObj.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Karta egasi:</span>
                <span className="font-bold text-gray-900 dark:text-white">{cardInfo.holder}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/20 text-center"
              >
                Kabinetga O'tish
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs text-center transition-all"
              >
                Kurslarni Ko'rish
              </Link>
            </div>
          </div>
        ) : (
          /* To'lov sahifasi: 2 Ustunli zamonaviy ko'rinish - Ekran balandligiga 100% moslashgan */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 xl:gap-3.5 items-stretch flex-1 min-h-0">
            
            {/* CHAP USTUN: Reja tanlash, To'lov turi va Chek yuklash */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-2 sm:gap-2.5 min-h-0">
              
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
                            setStatusNotice(null);
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

              {/* 3. Chek yuklash qutisi */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-brand-500" />
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      3. To'lov Chekini Yuklash
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Rasm yoki PDF format</span>
                </div>

                <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-2 sm:p-2.5 text-center hover:border-brand-500 dark:hover:border-brand-500/50 transition-colors relative cursor-pointer bg-gray-50/50 dark:bg-white/[0.01]">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-2.5">
                      {filePreview ? (
                        <img
                          src={filePreview}
                          alt="Chek preview"
                          className="w-8 h-8 object-cover rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-xs">
                          {selectedFile.name}
                        </p>
                        <p className="text-[9px] text-brand-600 dark:text-brand-400 font-semibold">
                          Boshqa fayl tanlash uchun bosing
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 py-0.5">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
                        <UploadCloud className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                          Chek suratini bu yerga tashlang yoki faylni tanlang
                        </p>
                        <p className="text-[9px] text-gray-400">
                          PNG, JPG, JPEG yoki PDF (maksimal hajm 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUploadReceipt}
                  disabled={submitting || !selectedFile || (!isStarted && timeLeft <= 0)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Sotib Olish / Chekni Adminga Yuborish</span>
                </button>
              </div>

            </div>

            {/* O'NG USTUN: Realistik Zumrad HUMO Kartasi va Tafsilotlar */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-2 sm:gap-2.5 min-h-0">
              
              {/* REALISTIK HUMO KARTA KOMPONENTI */}
              <div className="relative w-full rounded-2xl p-3.5 sm:p-4 text-white shadow-xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-[#022c22] via-[#051f18] to-[#02130e] group transition-all duration-300">
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-between space-y-2.5 sm:space-y-3">
                  
                  {/* Chip, Contactless va HUMO logosi */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-6 rounded-md bg-gradient-to-tr from-[#ffe082] via-[#ffd54f] to-[#ffb300] p-0.5 border border-amber-500/50 shadow-inner flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-700/60" />
                        <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-700/60" />
                        <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-700/60" />
                        <div className="w-full h-full border border-amber-600/30 rounded-[2px]" />
                      </div>

                      <svg className="w-3.5 h-3.5 text-emerald-300/60 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                        <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                        <path d="M15.5 21.5a12 12 0 0 1 0-19" />
                      </svg>
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
                      <span className="text-[11px] font-black tracking-widest text-white drop-shadow">HUMO</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Karta raqami: 9860 3501 4972 8288 */}
                  <div className="space-y-0.5">
                    <p className="text-[8px] text-emerald-300 font-bold uppercase tracking-wider opacity-80">
                      Karta Raqami
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm sm:text-base font-mono font-black tracking-widest text-white drop-shadow-md selection:bg-emerald-500">
                        {cardInfo.number}
                      </p>
                      <button
                        type="button"
                        onClick={copyCardNumber}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer flex items-center space-x-1"
                        title="Karta raqamidan nusxa olish"
                      >
                        {copiedCard ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span className="text-[9px] font-bold">{copiedCard ? 'Nusxalandi' : 'Nusxa'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Karta pasti: Karta egasi */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <div>
                      <p className="text-[8px] text-emerald-300/80 font-bold uppercase tracking-widest">
                        Karta Egasi
                      </p>
                      <p className="text-[11px] font-mono font-black tracking-wider text-white">
                        {cardInfo.holder}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] text-emerald-300/80 font-bold uppercase tracking-widest">
                        To'lov Summasi
                      </p>
                      <p className="text-xs sm:text-sm font-black text-emerald-300">
                        {activePlanObj.price}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bankomat tanlanganda qo'shimcha telefon raqam */}
              {paymentMethod === 'bankomat' && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-0.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[8px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                          Kartaga Ulangan Telefon
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                          {cardInfo.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={copyPhoneNumber}
                      className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-[9px] font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      {copiedPhone ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? 'Nusxalandi' : 'Nusxa'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* To'lov bo'yicha ko'rsatma va kafolat */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col justify-between flex-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-1.5 mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Qanday amalga oshiriladi?</span>
                </h4>
                
                <ol className="space-y-1.5 text-[11px] text-gray-600 dark:text-gray-400 list-decimal list-inside leading-snug">
                  <li>
                    <strong className="text-gray-900 dark:text-white font-bold">To'lovni amalga oshiring:</strong> HUMO karta raqamiga {activePlanObj.price} o'tkazing.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white font-bold">Chekni saqlang:</strong> Ilova yoki bankomatdan to'lov cheki skrinshoti yoki suratini oling.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white font-bold">Yuklang va yuboring:</strong> Chek suratini yuqoridagi qutiga yuklang va tugmani bosing.
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white font-bold">Tezkor tasdiqlash:</strong> Admin 1 soatdan - 2 soatgacha tekshirib obunani faollashtiradi.
                  </li>
                </ol>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
