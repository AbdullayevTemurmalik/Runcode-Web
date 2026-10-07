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
  Building2,
  FileCheck,
  ShieldCheck,
  Loader2,
  Phone,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const PaymentModal = ({ isOpen, onClose, initialPlan = '1_month' }) => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotification();

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState('apps'); // 'apps' or 'bankomat'
  const [isStepTwo, setIsStepTwo] = useState(false);
  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [plans, setPlans] = useState({
    '1_month': { name: '1 Oylik Kirish', price: '50 000 so\'m', amount: 50000 },
    '2_months': { name: '2 Oylik Kirish', price: '90 000 so\'m', amount: 90000, recommended: true },
    '3_months': { name: '3 Oylik Kirish', price: '120 000 so\'m', amount: 120000 }
  });

  const [cardInfo, setCardInfo] = useState({
    number: '9860 3501 4972 8288',
    rawNumber: '9860350149728288',
    holder: 'Temurmalik Abdullayev',
    phone: '+998 90 696 79 99',
    rawPhone: '+998906967999'
  });

  useEffect(() => {
    if (initialPlan) {
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

  // Barcha tarif va karta ma'lumotlarini to'g'ridan-to'g'ri backenddan olish
  useEffect(() => {
    if (!isOpen) return;
    const fetchBackendConfig = async () => {
      try {
        const res = await api.get('/payments/config');
        if (res.success) {
          if (res.plans) setPlans(res.plans);
          if (res.cardDetails) {
            setCardInfo({
              number: res.cardDetails.cardNumber,
              rawNumber: res.cardDetails.cardRawNumber,
              holder: res.cardDetails.cardHolder,
              phone: res.cardDetails.phone,
              rawPhone: res.cardDetails.rawPhone || res.cardDetails.phone?.replace(/\s+/g, '')
            });
          }
        }
      } catch (err) {
        console.error('To\'lov konfiguratsiyasini yuklashda xatolik:', err);
      }
    };
    fetchBackendConfig();
  }, [isOpen]);

  // 2-Qadamga o'tish va teskari taymerni boshlash (Ilova: 30 min, Bankomat: 1 soat)
  const handleStartPayment = () => {
    setError(null);
    setIsStepTwo(true);
    const defaultSeconds = paymentMethod === 'bankomat' ? 3600 : 1800;
    setTimeLeft(defaultSeconds);
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

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardInfo.rawNumber || '9860350149728288');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(cardInfo.phone || '+998 90 696 79 99');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
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
    setIsSuccess(false);
    setError(null);
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
                Sizning {plans[selectedPlan]?.name} to'lov chekingiz qabul qilindi. Tez orada admin kartaga pul tushganini tekshirib tasdiqlaydi (odatda 5-15 daqiqa). Tasdiqlangach sizga shaxsiy bildirishnoma boradi va Telegram guruh ochiladi.
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
                <div className="grid grid-cols-3 gap-2.5">
                  {Object.entries(plans).map(([key, plan]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer ${
                        selectedPlan === key
                          ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Tavsiya
                        </span>
                      )}
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{plan.name}</p>
                      <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-1">{plan.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* To'lov usuli tanlash */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To'lov qayerdan amalga oshiriladi?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apps')}
                    className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer ${
                      paymentMethod === 'apps'
                        ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Ilova orqali</p>
                      <p className="text-[10px] text-gray-500">Payme, Click, Uzum (30 daqiqa)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bankomat')}
                    className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer ${
                      paymentMethod === 'bankomat'
                        ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">Bankomat orqali</p>
                      <p className="text-[10px] text-gray-500">Naqd / Terminal (1 soat)</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Aniq vaqt va ogohlantirish (User talabi bo'yicha Ilova: 30 min, Bankomat: 1 soat) */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start space-x-2.5">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                  {paymentMethod === 'bankomat' ? (
                    <>
                      "To'lovni Boshlash" tugmasini bosganingizdan so'ng, karta raqami va ma'lumotlar chiqadi va <strong>1 soatlik (60 daqiqa) teskari taymer</strong> ishga tushadi. 1 soat ichida bankomat orqali to'lov qilib, chek suratini yuklashingiz zarur.
                    </>
                  ) : (
                    <>
                      "To'lovni Boshlash" tugmasini bosganingizdan so'ng, karta raqami chiqadi va <strong>30 daqiqalik teskari taymer</strong> ishga tushadi. 30 daqiqa ichida chek suratini yuklashingiz zarur.
                    </>
                  )}
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
            /* 2-Qadam: Karta rekvizitlari, faol taymer va Chek yuklash */
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
                      {paymentMethod === 'bankomat' ? 'Bankomat to\'lovi uchun qolgan vaqt:' : 'Chek yuklash uchun qolgan vaqt:'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {paymentMethod === 'bankomat' ? '1 soat (60 daqiqa) limit' : '30 daqiqa limit'} • Vaqt tugasa so'rov bekor qilinadi
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-mono font-black ${timeLeft < 300 ? 'text-rose-500 animate-bounce' : 'text-brand-600 dark:text-brand-400'}`}>
                  {formatTimer(timeLeft)}
                </div>
              </div>

              {/* Karta ma'lumotlari */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>To'lov miqdori:</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {(plans[selectedPlan]?.amount || 50000).toLocaleString()} so'm
                  </span>
                </div>
                
                {/* Karta raqami: 9860 3501 4972 8288 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Karta raqami</p>
                    <p className="text-sm font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                      {cardInfo.number}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyCardNumber}
                    className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                  >
                    {copiedCard ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCard ? 'Nusxalandi' : 'Nusxa olish'}</span>
                  </button>
                </div>

                {/* Karta egasi: Temurmalik Abdullayev */}
                <div className="flex items-center justify-between text-xs py-1 px-1">
                  <span className="text-gray-500 flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span>Karta egasi:</span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    {cardInfo.holder}
                  </span>
                </div>

                {/* Bankomat tanlansa ulangan nomer chiqishi: +998 90 696 79 99 */}
                {paymentMethod === 'bankomat' && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase">
                          Ulangan telefon raqam:
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                          {cardInfo.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyPhoneNumber}
                      className="p-2 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPhone ? 'Nusxalandi' : 'Nusxa'}</span>
                    </button>
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
              <button
                type="button"
                onClick={handleUploadReceipt}
                disabled={submitting || !selectedFile || timeLeft <= 0}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Sotib Olish / Chekni Yuborish</span>
              </button>

            </div>
          )}

        </div>

      </div>
      </div>
    </div>,
    document.body
  );
};
