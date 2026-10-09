import React from 'react';
import { Send, ShieldCheck, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const DashboardCommunityCard = ({
  user,
  hasSubscription,
  onOpenPaymentModal,
  navigate
}) => {
  const botUsername = 'RunCodeVerifyBot';
  const botUrl = user?.id 
    ? `https://t.me/${botUsername}?start=${user.id}` 
    : `https://t.me/${botUsername}`;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
      {/* Orqa fon nur effekti */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>Yopiq Telegram Jamiyati & Middle Mentorlik</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  @RunCodeVerifyBot
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Har kuni tajribali middle dasturchilar kodingizdagi xatolarni ko'rib chiqishadi, portfolio va topshiriqlaringizga feedback berishadi. Kanalga va guruhga kirish rasmiy <span className="text-sky-500 font-bold">@RunCodeVerifyBot</span> orqali 1 martalik xavfsiz havola bilan amalga oshiriladi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* ASOSIY TUGMA: Yangi va Faol barcha foydalanuvchilar uchun Telegram Botga o'tish */}
          <a
            href={botUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Kanalga Qo'shilish (@RunCodeVerifyBot)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {!hasSubscription && (
            <button
              type="button"
              onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
              className="px-4 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tarifni Tanlash</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span>Bot hisobingizni (ID: #{user?.id || '—'}) avtomatik tekshiradi va 5 daqiqalik bir martalik havola beradi.</span>
        </div>
        {hasSubscription ? (
          <span className="text-emerald-500 font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Aktiv Obuna Tasdiqlangan
          </span>
        ) : (
          <span className="text-amber-500/90 font-medium">
            Bepul a'zo • Botda tekshiruvdan o'tishingiz mumkin
          </span>
        )}
      </div>
    </div>
  );
};
