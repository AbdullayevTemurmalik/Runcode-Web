import React from 'react';
import { Smartphone, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const ConcurrentLoginModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  const handleReLogin = () => {
    if (onClose) onClose();
    window.location.href = '/login';
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-red-200/60 dark:border-red-900/40 p-6 sm:p-8 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Yuqori neon bezak nuri */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/15 dark:bg-red-500/25 blur-3xl rounded-full pointer-events-none" />

        {/* Belgilangan Ikonka */}
        <div className="relative mx-auto mb-5 w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-500/20 to-amber-500/20 border border-red-500/30 flex items-center justify-center shadow-lg">
          <div className="relative">
            <Smartphone className="w-10 h-10 text-red-500 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Sarlavha */}
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
          Boshqa Qurilmadan Kirildi
        </h3>

        {/* Xabar */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {message || "Sizning hisobingizga boshqa qurilma yoki brauzerdan kirildi. Xavfsizlik yuzasidan joriy sessiyangiz to'xtatildi."}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-3.5 mb-6 text-xs text-amber-800 dark:text-amber-300 text-left flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            RunCode.uz qoidasiga ko'ra, 1 ta akkauntdan bir vaqtda faqat bitta faol qurilmada foydalanish mumkin. Agar bu siz bo'lmasangiz, hisobingiz parolini yangilang.
          </span>
        </div>

        {/* Harakat tugmasi */}
        <button
          onClick={handleReLogin}
          className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-lg shadow-red-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span>Qayta tizimga kirish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
