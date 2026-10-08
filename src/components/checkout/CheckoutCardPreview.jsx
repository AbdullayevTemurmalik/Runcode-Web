import React from 'react';
import { 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  FileCheck, 
  UploadCloud, 
  Zap,
  Wifi
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
    <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
      
      {/* REALISTIK HUMO DEBIT BANK KARTASI (STANDART ID-1 O'LCHAM VA SHAKL) */}
      <div className="relative w-full rounded-3xl p-4 sm:p-5 lg:p-6 text-white shadow-2xl overflow-hidden border border-emerald-400/30 bg-gradient-to-br from-[#023325] via-[#04261d] to-[#01140e] group transition-all duration-300">
        
        {/* Yorug'lik va neft-metall jilo effektlari */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between space-y-4 sm:space-y-5">
          
          {/* Karta yuqori qismi: EMV Oltin Chip, Wi-Fi NFC to'lqinlari va HUMO logosi */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              
              {/* Haqiqiy 3D Oltin EMV Mikrosxema (Chip) */}
              <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-[#e5a93b] via-[#ffd700] to-[#f4c430] p-1 border border-amber-600/70 shadow-md relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-900/50" />
                <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-900/50" />
                <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-900/50" />
                <div className="w-full h-full border border-amber-700/40 rounded-[3px] bg-transparent" />
              </div>

              {/* NFC / Kontaktsiz to'lov simvoli */}
              <div className="flex items-center text-emerald-300/80">
                <Wifi className="w-5 h-5 rotate-90 drop-shadow" />
              </div>
            </div>

            {/* Rasmiy HUMO Plastik Kartasi Logotipi */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className="text-xs sm:text-sm font-black tracking-widest text-white drop-shadow">HUMO</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            </div>
          </div>

          {/* Karta markazi: Bo'rtma (Embossed) Karta Raqami va Nusxa Tugmasi */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-emerald-300 font-bold uppercase tracking-widest opacity-90 drop-shadow">
                Karta Raqami
              </span>
              <button
                type="button"
                onClick={copyCardNumber}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-white border border-emerald-400/30 backdrop-blur-md transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95"
                title="Karta raqamidan nusxa olish"
              >
                {copiedCard ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-xs font-bold text-emerald-200">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-bold">Nusxa</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-lg sm:text-2xl lg:text-3xl font-mono font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-all py-0.5">
              {cardInfo.number}
            </p>
          </div>

          {/* Karta pasti: Karta Egasi va To'lov Summasi */}
          <div className="flex items-end justify-between pt-2 border-t border-white/15">
            <div>
              <p className="text-[9px] sm:text-[10px] text-emerald-300/90 font-bold uppercase tracking-widest">
                Karta Egasi
              </p>
              <p className="text-sm sm:text-base font-mono font-black tracking-wider text-white drop-shadow uppercase">
                {cardInfo.holder}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] text-emerald-300/90 font-bold uppercase tracking-widest">
                To'lov Summasi
              </p>
              <p className="text-base sm:text-xl font-black text-emerald-300 drop-shadow">
                {activePlanObj.price}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bankomat tanlanganda Telefon raqami bloki */}
      {paymentMethod === 'bankomat' && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 animate-in fade-in flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                Kartaga Ulangan Telefon Raqam:
              </p>
              <p className="text-sm sm:text-base font-mono font-black text-gray-900 dark:text-white">
                {cardInfo.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyPhoneNumber}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-amber-500/30"
          >
            {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPhone ? 'Nusxalandi' : 'Nusxa'}</span>
          </button>
        </div>
      )}

      {/* TO'LOV BO'YICHA 4 TA ASOSIY QONUN-QOIDA (2x2 RANG-BARANG VA KATTA KARTALAR) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-[#0c101a] border border-gray-200 dark:border-white/10 shadow-sm flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
              To'lov Bo'yicha 4 Ta Qonun-Qoida
            </h4>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            100% Xavfsiz
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          
          {/* 1-Qonun: To'lovni O'tkazish (Zumrad Yashil) */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col justify-between space-y-2 hover:border-emerald-500/50 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-emerald-500 text-white shadow-sm">
                01
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                To'lovni O'tkazing
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">
                HUMO kartasiga <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{activePlanObj.price}</strong> mablag'ni o'tkazing.
              </p>
            </div>
          </div>

          {/* 2-Qonun: Chekni Saqlab Olish (Moviy / Sky) */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-sky-500/30 bg-sky-500/5 dark:bg-sky-950/20 flex flex-col justify-between space-y-2 hover:border-sky-500/50 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-sky-500 text-white shadow-sm">
                02
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-500 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                Chekni Saqlang
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">
                Ilova yoki bankomatdan to'lov cheki skrinshotini yoki suratini oling.
              </p>
            </div>
          </div>

          {/* 3-Qonun: Chekni Yuklash (Binafsha / Purple) */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 flex flex-col justify-between space-y-2 hover:border-purple-500/50 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-purple-500 text-white shadow-sm">
                03
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                Chekni Yuklang
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">
                Chek faylini saytga yuklab, tasdiqlash uchun yuboring.
              </p>
            </div>
          </div>

          {/* 4-Qonun: Tezkor Tasdiqlash (Qahrabo / Amber) */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 flex flex-col justify-between space-y-2 hover:border-amber-500/50 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-amber-500 text-white shadow-sm">
                04
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                Tezkor Tasdiq
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mt-1">
                Admin 1 soatdan - 2 soatgacha tekshirib obunani yoqadi.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
