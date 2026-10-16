import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const CheckoutPendingNotice = ({ activePlanObj, paymentMethod }) => {
  return (
    <div className="hidden lg:flex flex-col gap-2.5 w-full animate-in fade-in duration-200">
      <div className="p-3.5 xl:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2.5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider leading-tight">
                To'lov Rekvizitlari
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                To'lov boshlangach faollashadi
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            Himoyalangan
          </span>
        </div>

        {/* Tanlov xulosasi */}
        <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Tanlangan tarif:</span>
            <span className="font-bold text-gray-900 dark:text-white">{activePlanObj.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">To'lov usuli:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {paymentMethod === 'uzum'
                ? 'Uzum Bank (QR & Ilova)'
                : 'Click Up (QR & To\'lov Havolasi)'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-200/50 dark:border-white/5">
            <span className="text-gray-500 dark:text-gray-400 font-medium">To'lov summasi:</span>
            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 font-mono">
              {activePlanObj.price}
            </span>
          </div>
        </div>

        {/* Ko'rsatma va Qat'iy Ogohlantirish */}
        <div className="p-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-gray-600 dark:text-gray-300 space-y-1.5 leading-snug">
          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
            Rekvizitlarni qanday faollashtirasiz?
          </p>
          <p className="text-[10px]">
            1. Chap tomondagi <strong>"To'lovni Boshlash va Rekvizitlarni Faollashtirish"</strong> tugmasini bosing.
          </p>
          <p className="text-[10px]">
            2. To'lov tasdiqlangach, {
              paymentMethod === 'uzum'
                ? "Uzum Bank rasmiy QR-kodi va ilovada to'lash havolasi"
                : "Click Up rasmiy QR-kodi va to'g'ridan-to'g'ri to'lov havolasi"
            } ochiladi.
          </p>
          <p className="text-[10px]">
            3. To'lovni amalga oshirish va chek suratini yuklash uchun <strong>30 daqiqa</strong> vaqt beriladi.
          </p>
          <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 pt-0.5 border-t border-emerald-500/15">
            Eslatma: To'lov to'liq bo'lishi shart hamda to'lov chekini yuklash majburiydir.
          </p>
        </div>

        {/* 4 Qoida qisqacha */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-0.5">
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <span className="font-black text-emerald-600 dark:text-emerald-400 block mb-0.5">01. Rekvizit</span>
            <span className="text-gray-500 dark:text-gray-400">Karta yoki QR-kod</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <span className="font-black text-sky-600 dark:text-sky-400 block mb-0.5">02. To'lov</span>
            <span className="text-gray-500 dark:text-gray-400">Pulni o'tkazish</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <span className="font-black text-purple-600 dark:text-purple-400 block mb-0.5">03. Chek</span>
            <span className="text-gray-500 dark:text-gray-400">Skrinshotni olish</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <span className="font-black text-amber-600 dark:text-amber-400 block mb-0.5">04. Tasdiq</span>
            <span className="text-gray-500 dark:text-gray-400">Tezkor tekshiruv</span>
          </div>
        </div>

      </div>
    </div>
  );
};
