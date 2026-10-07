import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LogoutModal = ({ isOpen, onClose, onConfirm, user }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // React Portal orqali to'g'ridan-to'g'ri document.body ga render qilamiz.
  // Bu orqali headerdagi backdrop-blur yoki transform uni ekrandan surib yubormaydi,
  // modal har doim 100% ekranning qoq markazida (o'rtada) turadi!
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card (Markazda, shadow va zamonaviy neon border bilan) */}
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0c101c] border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exit Icon with Glowing Ring */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/15">
            <LogOut className="w-8 h-8 ml-1" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Hisobdan Chiqish
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
            Haqiqatan ham o'z profilingizdan chiqmoqchimisiz? Darslar va o'qish taraqqiyotingiz to'liq saqlanadi.
          </p>
        </div>

        {/* User Identity Preview Box */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
              {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user.fullName || user.username}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {user.username ? `@${user.username}` : user.email}
              </p>
            </div>
            {user.hasSubscription && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex-shrink-0">
                Aktiv
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-all cursor-pointer text-center"
          >
            Bekor qilish
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Ha, chiqish</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
