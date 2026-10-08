import React from 'react';
import { Copy, Check, Phone, ShieldCheck } from 'lucide-react';

export const CheckoutCardPreview = ({
  cardInfo,
  activePlanObj,
  paymentMethod,
  copiedCard,
  copyCardNumber,
  copiedPhone,
  copyPhoneNumber
}) => {
  return (
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

          {/* Karta raqami */}
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
  );
};
