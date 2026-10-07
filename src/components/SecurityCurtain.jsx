import React from 'react';
import { ShieldAlert, EyeOff, Lock } from 'lucide-react';

export const SecurityCurtain = ({ isPrtScnTriggered, isWindowBlurred, warningMessage }) => {
  return (
    <>
      {/* 1. PrintScreen bosilganda qoraytiruvchi qalqon */}
      {isPrtScnTriggered && (
        <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
          <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mb-4 animate-bounce">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            Skrinshot Olish Taqiqlangan!
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-md">
            Ushbu darslik mualliflik huquqi bilan qat'iy himoyalangan. Skrinshot va nusxa ko'chirishga urinish tizim tomonidan qayd etiladi.
          </p>
        </div>
      )}

      {/* 2. Snipping Tool yoki boshqa dastur ochilganda (Focus yo'qolganda) himoya pardasi */}
      {!isPrtScnTriggered && isWindowBlurred && (
        <div 
          tabIndex={-1}
          className="fixed inset-0 z-[99998] bg-black/75 dark:bg-[#070a13]/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
            <EyeOff className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Himoyalangan Ta'lim Muhiti</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Ekran Vaqtincha Yopildi
          </h3>
          <p className="text-sm text-gray-300 max-w-sm mb-5 leading-relaxed">
            Tashqi skrinshot yoki boshqa dasturga o'tilganda ma'lumotlar himoyasi ishga tushadi.
          </p>
          <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-4 py-2 rounded-xl">
            Davom ettirish uchun brauzer oynasini bosing
          </span>
        </div>
      )}

      {/* 3. Foydalanuvchiga kichik suzuvchi xavfsizlik toasti (Ctrl+C, o'ng tugma bosilganda) */}
      {warningMessage && !isPrtScnTriggered && !isWindowBlurred && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-2xl bg-gray-900/90 text-white border border-gray-700/60 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-slide-up select-none pointer-events-none">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}
    </>
  );
};
