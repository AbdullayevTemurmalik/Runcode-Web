import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  FileCheck, 
  UploadCloud, 
  Zap, 
  Wifi, 
  QrCode, 
  ExternalLink, 
  Smartphone,
  ZoomIn,
  Download,
  X,
  Maximize2
} from 'lucide-react';

const UZUM_PAYMENT_URL = 'https://b.2u.uz/ttc?qr=Nzk5MzoyMDU4NjEzMjowMU00VDA0VlgyNjVYQU1IR1k5SjdNV1ZEODp1OVhXZWtrenRJNmNadm5oZVhXQ1NhOWJOdFk9';
const CLICK_PAYMENT_URL = 'https://my.click.uz/clickp2p/9E9EB6EE67E40DB610877D03FC6AB8BD136BDBF5F386F48C91E40184E1EB9EE7';

export const CheckoutCardPreview = ({
  cardInfo,
  activePlanObj,
  paymentMethod,
  copiedCard,
  copyCardNumber,
  copiedPhone,
  copyPhoneNumber,
  appliedPromo
}) => {
  const [copiedUzumLink, setCopiedUzumLink] = useState(false);
  const [copiedClickLink, setCopiedClickLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const isClick = paymentMethod === 'apps' || paymentMethod === 'click';
  const isUzum = paymentMethod === 'uzum';

  const copyUzumLink = () => {
    navigator.clipboard.writeText(UZUM_PAYMENT_URL);
    setCopiedUzumLink(true);
    setTimeout(() => setCopiedUzumLink(false), 2000);
  };

  const copyClickLink = () => {
    navigator.clipboard.writeText(CLICK_PAYMENT_URL);
    setCopiedClickLink(true);
    setTimeout(() => setCopiedClickLink(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = isClick ? '/click-qr.png' : '/uzum-qr.png';
    link.download = isClick ? 'Click_RunCode_QR.png' : 'UzumBank_RunCode_QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsQrModalOpen(false);
    };
    if (isQrModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQrModalOpen]);

  return (
    <div className="w-full h-full select-none">
      {isClick ? (
        /* CLICK UP: QR KOD VA 4 TA QONUN-QOIDA YONMA-YON (TEPADAN PASTGA) */
        <div className="relative w-full h-auto lg:h-full flex flex-col justify-between rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 lg:p-5.5 xl:p-6 text-white shadow-2xl overflow-hidden border border-blue-500/40 bg-gradient-to-br from-[#061b36] via-[#040e21] to-[#020712]">
          
          {/* Neon jilo effektlari */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Yuqori sarlavha */}
          <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-blue-500/25">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#005cd4] to-[#0099ff] flex items-center justify-center text-white shadow-lg shadow-blue-900/60">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">CLICK UP</span>
                <span className="text-xs text-blue-300/90 font-medium">Rasmiy QR To'lov Tizimi</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-400/40 shadow-sm">
              <span className="text-xs font-black text-blue-200 tracking-wide">Tezkor QR</span>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-sm shadow-blue-400" />
            </div>
          </div>

          {/* 2 USTUNLI ASOSIY BLOK: Chapda QR-kod va tugmalar, O'ngda 4 qoida */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 lg:gap-4 xl:gap-5 items-stretch flex-1">
            
            {/* CHAP USTUN: QR-kod, Narx va Tugmalar (6 ustun) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-3 p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner">
              
              {/* QR-Kod container */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  onClick={() => setIsQrModalOpen(true)}
                  className="group relative cursor-pointer"
                  title="To'liq ekranda (350x350) ochish uchun bosing"
                >
                  <div className="w-[195px] h-[195px] sm:w-[215px] sm:h-[215px] md:w-[200px] md:h-[200px] lg:w-[210px] lg:h-[210px] xl:w-[235px] xl:h-[235px] aspect-square bg-white p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center border-2 border-blue-500/40 relative overflow-hidden transition-all group-hover:border-blue-400 group-hover:shadow-blue-500/40 group-hover:scale-[1.01]">
                    
                    {/* 4 Burchakdagi Skaner Fokus Ramkalari */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-blue-600 rounded-tl-sm pointer-events-none" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-blue-600 rounded-tr-sm pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-blue-600 rounded-bl-sm pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-blue-600 rounded-br-sm pointer-events-none" />

                    <img 
                      src="/click-qr.png" 
                      alt="Click Up QR" 
                      className="w-full h-full object-contain select-none"
                      style={{ imageRendering: 'crisp-edges' }}
                    />

                    {/* Hoverda Kattalashtirish overlay belgisi */}
                    <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 px-2.5 py-0.5 rounded-full">
                        350x350 Kattalashtirish
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skaner qilish tavsiyasi va kattalashtirish tugmasi */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-xs text-blue-200/90 font-medium text-center">
                    Click orqali to'g'ridan-to'g'ri skanerlang
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-200 hover:text-white bg-blue-500/25 hover:bg-blue-500/45 px-2.5 py-0.5 rounded-md border border-blue-400/30 transition cursor-pointer"
                    title="To'liq ekranda ko'rish"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-blue-300" />
                    <span>Kattalashtirish</span>
                  </button>
                </div>
              </div>

              {/* Summa va Havola tugmalari */}
              <div className="pt-2 border-t border-blue-500/25 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                    To'lov Summasi:
                  </span>
                  <div className="text-right">
                    {activePlanObj?.isDiscounted && activePlanObj?.appliedPromo ? (
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs font-bold line-through text-blue-300/50 font-mono">
                          {activePlanObj.basePrice || activePlanObj.originalPrice}
                        </span>
                        <span className="text-lg sm:text-2xl font-black text-blue-100 font-mono">
                          {activePlanObj.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg sm:text-2xl font-black text-blue-100 font-mono">
                        {activePlanObj.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tugmalar: 1-qator: Ilovada To'lash (full width), 2-qator: Havola va QR (50/50) */}
                <div className="flex flex-col gap-1.5">
                  <a
                    href={CLICK_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-blue-600/40 flex items-center justify-center space-x-1.5 transition active:scale-[0.99] cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Ilovada To'lash</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={copyClickLink}
                      className="py-2 px-2 rounded-xl sm:rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 active:scale-95"
                      title="Havoladan nusxa olish"
                    >
                      {copiedClickLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs">Nusxalandi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-200" />
                          <span className="text-xs">Havola Nusxa</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="py-2 px-2 rounded-xl sm:rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 active:scale-95"
                      title="QR-kod suratini yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-200" />
                      <span className="text-xs">QR Saqlash</span>
                    </button>
                  </div>
                </div>

                {/* Skanerlash va to'lov yo'riqnomasi */}
                <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-500/15 border border-blue-400/25 text-xs text-blue-100 text-center leading-snug space-y-0.5">
                  <p className="font-bold text-white flex items-center justify-center gap-1.5 text-xs sm:text-[13px]">
                    <QrCode className="w-4 h-4 text-blue-300" />
                    <span>Boshqa telefon (ota-ona) yoki o'z telefoningizdan to'lash:</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-blue-200/90 leading-tight">
                    Ota-onangiz yoki boshqa telefondan to'lash uchun kamerani to'g'ridan-to'g'ri ushbu QR-kodga qarating. O'z telefoningizda bo'lsangiz <strong>"Ilovada To'lash"</strong> tugmasini bosing.
                  </p>
                </div>
              </div>

            </div>

            {/* O'NG USTUN: 4 Ta Qonun-Qoida */}
            <div className="md:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-2.5 sm:space-y-3">
              
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/25">
                <span className="text-xs sm:text-sm md:text-[14.5px] font-black uppercase tracking-wider text-blue-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  4 Qonun-Qoida
                </span>
                <span className="text-[10.5px] sm:text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  100% Xavfsiz
                </span>
              </div>

              {/* 01. To'lovni o'tkazing */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-emerald-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 flex-shrink-0 mt-0.5">
                  01
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">To'lovni O'tkazing</p>
                  <p className="text-[11px] sm:text-xs text-blue-100/90 mt-1 leading-snug">
                    Click QR yoki Click ilovasi orqali to'lovni bajaring.
                  </p>
                </div>
              </div>

              {/* 02. Chekni saqlang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-sky-500/35 bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-sky-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-sky-500/25 flex-shrink-0 mt-0.5">
                  02
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Saqlang</p>
                  <p className="text-[11px] sm:text-xs text-blue-100/90 mt-1 leading-snug">
                    To'lov cheki skrinshotini (fotosurati yoki PDF) saqlab oling.
                  </p>
                </div>
              </div>

              {/* 03. Chekni yuklang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-purple-500/35 bg-gradient-to-r from-purple-500/20 via-purple-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-purple-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-purple-500/25 flex-shrink-0 mt-0.5">
                  03
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Yuklang</p>
                  <p className="text-[11px] sm:text-xs text-blue-100/90 mt-1 leading-snug">
                    Ushbu sahifada chek faylini yuklab tizimga yuboring.
                  </p>
                </div>
              </div>

              {/* 04. Tezkor tasdiq */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-amber-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex-shrink-0 mt-0.5">
                  04
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Tezkor Tasdiq</p>
                  <p className="text-[11px] sm:text-xs text-blue-100/90 mt-1 leading-snug">
                    Admin 10-15 daqiqada tekshirib tarifingizni faollashtiradi.
                  </p>
                </div>
              </div>

              {/* Pastki Ishonchli Tizim Eslatmasi */}
              <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center space-x-2 text-[10.5px] sm:text-xs text-blue-200 text-center font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>To'lov 24/7 avtomatlashtirilgan xavfsiz tizim orqali qabul qilinadi</span>
              </div>

            </div>

          </div>

        </div>
      ) : isUzum ? (
        /* UZUM BANK: QR KOD VA 4 TA QONUN-QOIDA YONMA-YON (TEPADAN PASTGA) */
        <div className="relative w-full h-auto lg:h-full flex flex-col justify-between rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 lg:p-5.5 xl:p-6 text-white shadow-2xl overflow-hidden border border-purple-500/40 bg-gradient-to-br from-[#240533] via-[#14031d] to-[#09010e]">
          
          {/* Neon jilo effektlari */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Yuqori sarlavha */}
          <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-purple-500/25">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#7b2cbf] to-[#9d4edd] flex items-center justify-center text-white shadow-lg shadow-purple-900/60">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">UZUM BANK</span>
                <span className="text-xs text-purple-300/90 font-medium">Rasmiy QR To'lov Tizimi</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 shadow-sm">
              <span className="text-xs font-black text-purple-200 tracking-wide">Tezkor QR</span>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-sm shadow-purple-400" />
            </div>
          </div>

          {/* 2 USTUNLI ASOSIY BLOK: Chapda QR-kod va tugmalar, O'ngda 4 qoida (1.5x Katta va Chiroyli) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 lg:gap-4 xl:gap-5 items-stretch flex-1">
            
            {/* CHAP USTUN: QR-kod, Narx va Tugmalar (6 ustun) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-3 p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner">
              
              {/* QR-Kod container - Yuqori aniqlikdagi skanerlash ramkasi */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  onClick={() => setIsQrModalOpen(true)}
                  className="group relative cursor-pointer"
                  title="To'liq ekranda (350x350) ochish uchun bosing"
                >
                  <div className="w-[195px] h-[195px] sm:w-[215px] sm:h-[215px] md:w-[200px] md:h-[200px] lg:w-[210px] lg:h-[210px] xl:w-[235px] xl:h-[235px] aspect-square bg-white p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center border-2 border-purple-500/40 relative overflow-hidden transition-all group-hover:border-purple-400 group-hover:shadow-purple-500/40 group-hover:scale-[1.01]">
                    
                    {/* 4 Burchakdagi Skaner Fokus Ramkalari */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-purple-600 rounded-tl-sm pointer-events-none" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-purple-600 rounded-tr-sm pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-purple-600 rounded-bl-sm pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-purple-600 rounded-br-sm pointer-events-none" />

                    <img 
                      src="/uzum-qr.png" 
                      alt="Uzum Bank QR" 
                      className="w-full h-full object-contain select-none"
                      style={{ imageRendering: 'crisp-edges' }}
                    />

                    {/* Hoverda Kattalashtirish overlay belgisi */}
                    <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 px-2.5 py-0.5 rounded-full">
                        350x350 Kattalashtirish
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skaner qilish tavsiyasi va kattalashtirish tugmasi */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-xs text-purple-200/90 font-medium text-center">
                    Uzum Bank orqali to'g'ridan-to'g'ri skanerlang
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-200 hover:text-white bg-purple-500/25 hover:bg-purple-500/45 px-2.5 py-0.5 rounded-md border border-purple-400/30 transition cursor-pointer"
                    title="To'liq ekranda ko'rish"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-purple-300" />
                    <span>Kattalashtirish</span>
                  </button>
                </div>
              </div>

              {/* Summa va Havola tugmalari */}
              <div className="pt-2 border-t border-purple-500/25 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
                    To'lov Summasi:
                  </span>
                  <div className="text-right">
                    {activePlanObj?.isDiscounted && activePlanObj?.appliedPromo ? (
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs font-bold line-through text-purple-300/50 font-mono">
                          {activePlanObj.basePrice || activePlanObj.originalPrice}
                        </span>
                        <span className="text-lg sm:text-2xl font-black text-purple-100 font-mono">
                          {activePlanObj.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg sm:text-2xl font-black text-purple-100 font-mono">
                        {activePlanObj.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tugmalar: 1-qator: Ilovada To'lash (full width), 2-qator: Havola va QR (50/50) */}
                <div className="flex flex-col gap-1.5">
                  <a
                    href={UZUM_PAYMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-purple-600/40 flex items-center justify-center space-x-1.5 transition active:scale-[0.99] cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Ilovada To'lash</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={copyUzumLink}
                      className="py-2 px-2 rounded-xl sm:rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 active:scale-95"
                      title="Havoladan nusxa olish"
                    >
                      {copiedUzumLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs">Nusxalandi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-purple-200" />
                          <span className="text-xs">Havola Nusxa</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="py-2 px-2 rounded-xl sm:rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 active:scale-95"
                      title="QR-kod suratini yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-200" />
                      <span className="text-xs">QR Saqlash</span>
                    </button>
                  </div>
                </div>

                {/* Skanerlash va to'lov yo'riqnomasi (Ota-ona yoki o'z telefonidan) - Katta va Chiroyli */}
                <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/15 border border-purple-400/25 text-xs text-purple-100 text-center leading-snug space-y-0.5">
                  <p className="font-bold text-white flex items-center justify-center gap-1.5 text-xs sm:text-[13px]">
                    <QrCode className="w-4 h-4 text-purple-300" />
                    <span>Boshqa telefon (ota-ona) yoki o'z telefoningizdan to'lash:</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-purple-200/90 leading-tight">
                    Ota-onangiz yoki boshqa telefondan to'lash uchun kamerani to'g'ridan-to'g'ri ushbu QR-kodga qarating. O'z telefoningizda bo'lsangiz <strong>"Ilovada To'lash"</strong> tugmasini bosing.
                  </p>
                </div>
              </div>

            </div>

            {/* O'NG USTUN: 4 Ta Qonun-Qoida (Tepadan pastga 01 -> 02 -> 03 -> 04) - TO'LIQ KONTAYNER DIVI BILAN */}
            <div className="md:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-2.5 sm:space-y-3">
              
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/25">
                <span className="text-xs sm:text-sm md:text-[14.5px] font-black uppercase tracking-wider text-purple-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  4 Qonun-Qoida
                </span>
                <span className="text-[10.5px] sm:text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  100% Xavfsiz
                </span>
              </div>

              {/* 01. To'lovni o'tkazing */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-emerald-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 flex-shrink-0 mt-0.5">
                  01
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">To'lovni O'tkazing</p>
                  <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 leading-snug">
                    Uzum Bank QR yoki mobil ilovasi orqali to'lovni bajaring.
                  </p>
                </div>
              </div>

              {/* 02. Chekni saqlang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-sky-500/35 bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-sky-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-sky-500/25 flex-shrink-0 mt-0.5">
                  02
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Saqlang</p>
                  <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 leading-snug">
                    To'lov cheki skrinshotini (fotosurati yoki PDF) saqlab oling.
                  </p>
                </div>
              </div>

              {/* 03. Chekni yuklang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-purple-500/35 bg-gradient-to-r from-purple-500/20 via-purple-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-purple-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-purple-500/25 flex-shrink-0 mt-0.5">
                  03
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Yuklang</p>
                  <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 leading-snug">
                    Ushbu sahifada chek faylini yuklab tizimga yuboring.
                  </p>
                </div>
              </div>

              {/* 04. Tezkor tasdiq */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-amber-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex-shrink-0 mt-0.5">
                  04
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Tezkor Tasdiq</p>
                  <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 leading-snug">
                    Admin 10-15 daqiqada tekshirib tarifingizni faollashtiradi.
                  </p>
                </div>
              </div>

              {/* Pastki Ishonchli Tizim Eslatmasi */}
              <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-400/25 flex items-center justify-center space-x-2 text-[10.5px] sm:text-xs text-purple-200 text-center font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>To'lov 24/7 avtomatlashtirilgan xavfsiz tizim orqali qabul qilinadi</span>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ODDIY HUMO KARTASI VA 4 TA QONUN-QOIDA YONMA-YON (TEPADAN PASTGA) */
        <div className="relative w-full h-auto lg:h-full flex flex-col justify-between rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 lg:p-5.5 xl:p-6 text-white shadow-2xl overflow-hidden border border-emerald-500/40 bg-gradient-to-br from-[#022a1e] via-[#031d17] to-[#01100b]">
          
          {/* Neft-metall jilo effektlari */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Yuqori sarlavha */}
          <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-emerald-400/25">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white shadow-lg shadow-emerald-900/60">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black tracking-wider text-white block leading-tight">HUMO DEBET KARTASI</span>
                <span className="text-xs text-emerald-300/90 font-medium">Milliy To'lov Tizimi</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 shadow-sm">
              <span className="text-xs font-black text-emerald-200 tracking-wide">HUMO</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            </div>
          </div>

          {/* 2 USTUNLI ASOSIY BLOK: Chapda Karta rekvizitlari, O'ngda 4 qoida (1.5x Katta va Chiroyli) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3.5 lg:gap-4 xl:gap-5 items-stretch flex-1">
            
            {/* CHAP USTUN: Haqiqiy Humo karta rekvizitlari (6 ustun) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-3 p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner">
              
              {/* Karta Chip & Contactless belgisi */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-7 rounded-lg bg-gradient-to-tr from-[#e5a93b] via-[#ffd700] to-[#f4c430] p-1 border border-amber-600/70 flex items-center justify-center shadow-md">
                  <div className="w-full h-full border border-amber-800/40 rounded flex items-center justify-center">
                    <div className="w-4 h-2 border-t border-b border-amber-900/40" />
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-300/80">
                  <Wifi className="w-4 h-4 rotate-90" />
                  <span className="text-[10px] font-bold tracking-wider">CONTACTLESS</span>
                </div>
              </div>

              {/* Karta Raqami bloki */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-black/25 border border-emerald-400/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                    Karta Raqami
                  </span>
                  <button
                    type="button"
                    onClick={copyCardNumber}
                    className="px-3 py-1 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/40 text-white border border-emerald-400/40 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 active:scale-95 shadow-sm"
                    title="Karta raqamidan nusxa olish"
                  >
                    {copiedCard ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Nusxalandi</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        <span>Nusxa olish</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-base sm:text-xl xl:text-2xl font-mono font-black tracking-widest text-white drop-shadow select-all py-1">
                  {cardInfo.number}
                </p>
              </div>

              {/* Karta egasi va Summa */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">
                    Karta Egasi
                  </p>
                  <p className="text-xs sm:text-sm font-mono font-black tracking-wide text-white uppercase mt-0.5">
                    {cardInfo.holder}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">
                    To'lov Summasi
                  </p>
                  {activePlanObj?.isDiscounted && activePlanObj?.appliedPromo ? (
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold line-through text-emerald-200/50 font-mono">
                        {activePlanObj.basePrice || activePlanObj.originalPrice}
                      </span>
                      <p className="text-base sm:text-xl font-black text-emerald-300 drop-shadow font-mono">
                        {activePlanObj.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-base sm:text-xl font-black text-emerald-300 drop-shadow font-mono">
                      {activePlanObj.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Bankomat tanlanganda ulangan telefon raqami */}
              {paymentMethod === 'bankomat' && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-amber-300 font-bold uppercase">Ulangan Telefon:</p>
                      <p className="text-xs sm:text-sm font-mono font-bold text-white">{cardInfo.phone}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyPhoneNumber}
                    className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 text-xs font-bold border border-amber-500/30 transition cursor-pointer"
                  >
                    {copiedPhone ? 'Nusxalandi' : 'Nusxa'}
                  </button>
                </div>
              )}

              {/* Yo'riqnoma qutisi */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 text-xs text-emerald-100 text-center leading-snug space-y-0.5">
                <p className="font-bold text-white flex items-center justify-center gap-1.5 text-xs sm:text-[13px]">
                  <CreditCard className="w-4 h-4 text-emerald-300" />
                  <span>To'lovni amalga oshirish yo'riqnomasi:</span>
                </p>
                <p className="text-[11px] sm:text-xs text-emerald-200/90 leading-tight">
                  Karta raqamiga to'lovni o'tkazing va to'lov kvitansiyasi (chek skrinshoti)ni saqlab oling.
                </p>
              </div>

            </div>

            {/* O'NG USTUN: 4 Ta Qonun-Qoida (Tepadan pastga 01 -> 02 -> 03 -> 04) - TO'LIQ KONTAYNER DIVI BILAN */}
            <div className="md:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-inner space-y-2.5 sm:space-y-3">
              
              <div className="flex items-center justify-between pb-2 border-b border-emerald-400/25">
                <span className="text-xs sm:text-sm md:text-[14.5px] font-black uppercase tracking-wider text-emerald-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  4 Qonun-Qoida
                </span>
                <span className="text-[10.5px] sm:text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                  100% Xavfsiz
                </span>
              </div>

              {/* 01. To'lovni o'tkazing */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-emerald-500/35 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-emerald-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 flex-shrink-0 mt-0.5">
                  01
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">To'lovni O'tkazing</p>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-1 leading-snug">
                    HUMO kartasiga to'lovni ilovangiz orqali aniq o'tkazing.
                  </p>
                </div>
              </div>

              {/* 02. Chekni saqlang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-sky-500/35 bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-sky-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-sky-500/25 flex-shrink-0 mt-0.5">
                  02
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Saqlang</p>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-1 leading-snug">
                    To'lov cheki skrinshotini (fotosurati yoki PDF) saqlab oling.
                  </p>
                </div>
              </div>

              {/* 03. Chekni yuklang */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-purple-500/35 bg-gradient-to-r from-purple-500/20 via-purple-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-purple-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-purple-500/25 flex-shrink-0 mt-0.5">
                  03
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Chekni Yuklang</p>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-1 leading-snug">
                    Ushbu sahifada chek faylini yuklab tizimga yuboring.
                  </p>
                </div>
              </div>

              {/* 04. Tezkor tasdiq */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent flex items-start space-x-3 shadow-sm hover:border-amber-400/50 transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 flex-shrink-0 mt-0.5">
                  04
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white leading-tight">Tezkor Tasdiq</p>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-1 leading-snug">
                    Admin 10-15 daqiqada tekshirib tarifingizni faollashtiradi.
                  </p>
                </div>
              </div>

              {/* Pastki Ishonchli Tizim Eslatmasi */}
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center space-x-2 text-[10.5px] sm:text-xs text-emerald-200 text-center font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>To'lov 24/7 avtomatlashtirilgan xavfsiz tizim orqali qabul qilinadi</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 350x350 TO'LIQ HAJMDAGI QR-KOD MODALI (NOTEBOOK VA MOBILDA SKANERLASH UCHUN) */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className={`relative w-full max-w-sm sm:max-w-md ${
              isClick 
                ? 'bg-[#061426] border-2 border-blue-500/60' 
                : 'bg-[#13031a] border-2 border-purple-500/60'
            } rounded-3xl p-4 sm:p-5 text-white shadow-2xl flex flex-col items-center space-y-3 animate-in zoom-in-95 duration-150`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Yuqori sarlavhasi */}
            <div className={`w-full flex items-center justify-between pb-2.5 border-b ${
              isClick ? 'border-blue-500/30' : 'border-purple-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-xl ${
                  isClick 
                    ? 'bg-gradient-to-tr from-[#005cd4] to-[#0099ff] shadow-blue-900/50' 
                    : 'bg-gradient-to-tr from-[#7b2cbf] to-[#9d4edd] shadow-purple-900/50'
                } flex items-center justify-center text-white shadow-md`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {isClick ? "Click Up QR-Kodi" : "Uzum Bank QR-Kodi"}
                  </h4>
                  <p className={`text-[10px] ${isClick ? 'text-blue-300/80' : 'text-purple-300/80'} font-medium`}>
                    350x350 Katta Hajmda Skanerlash
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                title="Yopish (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 350x350 Maxsus Katta QR-kod container */}
            <div className={`relative w-[285px] h-[285px] sm:w-[340px] sm:h-[340px] aspect-square bg-white p-3.5 sm:p-4 rounded-3xl shadow-2xl flex items-center justify-center border-4 ${
              isClick ? 'border-blue-500/50' : 'border-purple-500/50'
            }`}>
              {/* Burchak fokus ramkalari */}
              <div className={`absolute top-2 left-2 w-5 h-5 border-t-4 border-l-4 ${isClick ? 'border-blue-600' : 'border-purple-600'} rounded-tl-md pointer-events-none`} />
              <div className={`absolute top-2 right-2 w-5 h-5 border-t-4 border-r-4 ${isClick ? 'border-blue-600' : 'border-purple-600'} rounded-tr-md pointer-events-none`} />
              <div className={`absolute bottom-2 left-2 w-5 h-5 border-b-4 border-l-4 ${isClick ? 'border-blue-600' : 'border-purple-600'} rounded-bl-md pointer-events-none`} />
              <div className={`absolute bottom-2 right-2 w-5 h-5 border-b-4 border-r-4 ${isClick ? 'border-blue-600' : 'border-purple-600'} rounded-br-md pointer-events-none`} />

              <img 
                src={isClick ? '/click-qr.png' : '/uzum-qr.png'} 
                alt={isClick ? "Click Up QR Katta" : "Uzum Bank QR Katta"} 
                className="w-full h-full object-contain select-none"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>

            {/* Summa va Narx */}
            <div className={`w-full py-2 px-3 rounded-2xl ${
              isClick ? 'bg-blue-500/15 border border-blue-500/30' : 'bg-purple-500/15 border border-purple-500/30'
            } flex items-center justify-between text-xs`}>
              <span className={`${isClick ? 'text-blue-200' : 'text-purple-200'} font-bold uppercase tracking-wider text-[10px]`}>
                To'lov Summasi:
              </span>
              <span className={`font-mono font-black text-sm sm:text-base ${isClick ? 'text-blue-100' : 'text-purple-100'}`}>
                {activePlanObj.price}
              </span>
            </div>

            {/* Tugmalar */}
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <a
                href={isClick ? CLICK_PAYMENT_URL : UZUM_PAYMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-2.5 px-3 rounded-xl ${
                  isClick 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-600/30' 
                    : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-purple-600/30'
                } text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-1.5 transition active:scale-[0.99] cursor-pointer`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Ilovada To'lash</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleDownloadQR}
                className={`py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 ${
                  isClick ? 'text-blue-200 border border-blue-400/30' : 'text-purple-200 border border-purple-400/30'
                } text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95 flex-shrink-0`}
              >
                <Download className="w-4 h-4" />
                <span>QR Saqlash</span>
              </button>
            </div>

            <p className={`text-[10px] ${isClick ? 'text-blue-200/90' : 'text-purple-200/90'} text-center font-medium leading-tight`}>
              {isClick 
                ? "Ota-ona yoki boshqa telefondan Click ilovasida \"QR to'lov\" orqali ushbu QR-kodni skanerlang"
                : "Ota-ona yoki boshqa telefondan Uzum Bank ilovasida \"QR to'lov\" orqali ushbu QR-kodni skanerlang"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
