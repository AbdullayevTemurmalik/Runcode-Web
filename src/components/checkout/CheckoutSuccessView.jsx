import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const CheckoutSuccessView = ({ activePlanObj, cardInfo }) => {
  return (
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
  );
};
