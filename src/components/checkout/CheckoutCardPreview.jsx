import React from 'react';
import { 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  FileCheck, 
  UploadCloud, 
  Zap 
} from 'lucide-react';

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
    <div className="flex flex-col space-y-2 sm:space-y-2.5 min-h-0">
      
      {/* REALISTIK HUMO KARTA KOMPONENTI */}
      <div className="relative w-full rounded-2xl p-3.5 sm:p-4 text-white shadow-xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-[#022c22] via-[#051f18] to-[#02130e] group transition-all duration-300">
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between space-y-3">
          
          {/* Chip, Contactless va HUMO logosi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#ffe082] via-[#ffd54f] to-[#ffb300] p-0.5 border border-amber-500/50 shadow-inner flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-700/60" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-700/60" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-700/60" />
                <div className="w-full h-full border border-amber-600/30 rounded-[2px]" />
              </div>

              <svg className="w-4 h-4 text-emerald-300/70 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                <path d="M12 19a8.5 8.5 0 0 1 0-14" />
                <path d="M15.5 21.5a12 12 0 0 1 0-19" />
              </svg>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs font-black tracking-widest text-white drop-shadow">HUMO</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Karta raqami */}
          <div className="space-y-1">
            <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider opacity-85">
              Karta Raqami
            </p>
            <div className="flex items-center justify-between">
              <p className="text-base sm:text-lg lg:text-xl font-mono font-black tracking-widest text-white drop-shadow-md selection:bg-emerald-500">
                {cardInfo.number}
              </p>
              <button
                type="button"
                onClick={copyCardNumber}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
                title="Karta raqamidan nusxa olish"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-bold">{copiedCard ? 'Nusxalandi' : 'Nusxa'}</span>
              </button>
            </div>
          </div>

          {/* Karta pasti: Karta egasi va Summa */}
          <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
            <div>
              <p className="text-[8px] sm:text-[9px] text-emerald-300/80 font-bold uppercase tracking-widest">
                Karta Egasi
              </p>
              <p className="text-xs sm:text-sm font-mono font-black tracking-wider text-white">
                {cardInfo.holder}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[8px] sm:text-[9px] text-emerald-300/80 font-bold uppercase tracking-widest">
                To'lov Summasi
              </p>
              <p className="text-sm sm:text-base font-black text-emerald-300">
                {activePlanObj.price}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bankomat tanlanganda telefon raqam */}
      {paymentMethod === 'bankomat' && (
        <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Kartaga Ulangan Telefon
                </p>
                <p className="text-xs sm:text-sm font-mono font-bold text-gray-900 dark:text-white">
                  {cardInfo.phone}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={copyPhoneNumber}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1"
            >
              {copiedPhone ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPhone ? 'Nusxalandi' : 'Nusxa'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 TA QONUN / QOIDA - 2x2 COLORFUL GRID */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>To'lov Bo'yicha 4 Ta Qonun-Qoida</span>
          </h4>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">100% Xavfsiz</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {/* 1-Qoida: To'lovni o'tkazish (Emerald) */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col justify-between space-y-1 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                01
              </span>
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                To'lovni O'tkazing
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                HUMO kartasiga {activePlanObj.price} mablag'ni o'tkazing.
              </p>
            </div>
          </div>

          {/* 2-Qoida: Chekni saqlash (Sky Blue) */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-sky-500/25 bg-sky-500/5 dark:bg-sky-950/20 flex flex-col justify-between space-y-1 hover:border-sky-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                02
              </span>
              <FileCheck className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Chekni Saqlang
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                Ilova yoki bankomatdan to'lov cheki skrinshotini oling.
              </p>
            </div>
          </div>

          {/* 3-Qoida: Chekni yuklash (Purple) */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-purple-500/25 bg-purple-500/5 dark:bg-purple-950/20 flex flex-col justify-between space-y-1 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                03
              </span>
              <UploadCloud className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Chekni Yuklang
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                Chek rasmini yuklab, adminga tasdiqlash uchun yuboring.
              </p>
            </div>
          </div>

          {/* 4-Qoida: Tezkor tasdiqlash (Amber) */}
          <div className="p-2 sm:p-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-950/20 flex flex-col justify-between space-y-1 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                04
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Tezkor Tasdiqlash
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug mt-0.5">
                Admin 1 soatdan - 2 soatgacha tekshirib obunani yoqadi.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
