import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Ban, 
  HelpCircle,
  Sparkles,
  CreditCard
} from 'lucide-react';

const CANCEL_REASONS = [
  {
    id: 'unintentional',
    title: "Bilmasdan tanlab qo'ydim",
    desc: "Tasodifan yoki adashib to'lov rekvizitlarini ochib yubordim"
  },
  {
    id: 'change_plan',
    title: "Boshqa tarif rejasini tanlamoqchiman",
    desc: "Plus, Pro, Pro+ yoki Ultra tariflaridan boshqasiga o'tmoqchiman"
  },
  {
    id: 'change_method',
    title: "To'lov usulini o'zgartirmoqchiman",
    desc: "Ilova, Uzum Bank (QR) yoki Bankomat to'lov usulini almashtirmoqchiman"
  },
  {
    id: 'other',
    title: "Boshqa sabab",
    desc: "Boshqa sabab bilan buyurtmani to'xtatmoqchiman"
  }
];

export const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  order = null
}) => {
  const [selectedReason, setSelectedReason] = useState('unintentional');
  const [customReason, setCustomReason] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('unintentional');
      setCustomReason('');
      setErrorText('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || loading) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenObj = CANCEL_REASONS.find(r => r.id === selectedReason);
    const chosenTitle = chosenObj ? chosenObj.title : "Foydalanuvchi tomonidan bekor qilindi";

    let finalReasonText = chosenTitle;
    if (selectedReason === 'other') {
      if (!customReason.trim()) {
        setErrorText('Iltimos, bekor qilish sababini qisqacha yozing');
        return;
      }
      finalReasonText = `Boshqa sabab: ${customReason.trim()}`;
    } else if (customReason.trim()) {
      finalReasonText = `${chosenTitle} (${customReason.trim()})`;
    }

    onConfirm(finalReasonText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yopish tugmasi */}
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-13 h-13 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mb-3">
            <Ban className="w-6 h-6 stroke-[2.5]" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-snug">
            To'lov So'rovini Bekor Qilish
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 max-w-sm">
            Nima sababdan to'lovni bekor qilmoqchisiz? Sabablardan birini tanlang:
          </p>
        </div>

        {/* Sabablar Ro'yxati */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <button
                  key={reason.id}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setSelectedReason(reason.id);
                    setErrorText('');
                  }}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all flex items-start space-x-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500/10 dark:bg-rose-500/10 ring-1 ring-rose-500/30'
                      : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/15 bg-gray-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {reason.title}
                    </p>
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 font-medium leading-tight mt-0.5">
                      {reason.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Qo'shimcha izoh / Boshqa sabab maydoni */}
          {selectedReason === 'other' && (
            <div className="pt-1">
              <textarea
                value={customReason}
                disabled={loading}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (errorText) setErrorText('');
                }}
                rows={2}
                placeholder="Bekor qilish sababini yozing..."
                className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          )}

          {errorText && (
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-1.5 animate-in fade-in">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Ma'lumot eslatmasi */}
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500 mt-0.5" />
            <p className="leading-tight">
              Buyurtma bekor qilingach, joriy to'lov taymeri to'xtatiladi va siz istalgan yangi tarifni hamda to'lov usulini boshidan erkin tanlashingiz mumkin bo'ladi.
            </p>
          </div>

          {/* Tugmalar */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              Ortga qaytish
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>Bekor qilinmoqda...</span>
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 flex-shrink-0" />
                  <span>Ha, bekor qilish</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
