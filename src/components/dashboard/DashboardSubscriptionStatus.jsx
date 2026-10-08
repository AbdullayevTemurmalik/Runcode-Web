import React from 'react';
import { Calendar, Clock, Hourglass, Sparkles, CheckCircle2, CreditCard } from 'lucide-react';

export const DashboardSubscriptionStatus = ({
  user,
  hasSubscription,
  tierInfo,
  daysLeft,
  formatDate,
  nextSub,
  nextTierInfo,
  totalDays,
  elapsedDays,
  progressPercent,
  onOpenPaymentModal,
  navigate
}) => {
  const TierIcon = tierInfo.icon;

  return (
    <div className={`rounded-3xl bg-white dark:bg-[#0c0d12]/95 border ${hasSubscription ? tierInfo.borderGlow : 'border-gray-200 dark:border-white/10'} p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 transition-all duration-300`}>
      {/* Yuqori qism: Sarlavha va Status Nishoni */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5 gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            <TierIcon className="w-4 h-4" />
            <span>Obuna va Ta'lim Holati</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Mening Obunam va Statusim
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sizning platformadagi faol ta'lim tarifi, to'lov sanasi va qolgan muddat hisobi
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {hasSubscription ? (
            <div className="flex items-center space-x-2">
              <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 ${tierInfo.badgeColor} border shadow-sm`}>
                <TierIcon className="w-4 h-4" />
                <span>{tierInfo.title}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                Aktiv
              </span>
            </div>
          ) : (
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10">
              Bepul Reja
            </span>
          )}
        </div>
      </div>

      {/* 4 ta Asosiy Ko'rsatkich Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Status / Tarif */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <TierIcon className={`w-4 h-4 ${hasSubscription ? tierInfo.textColor : 'text-gray-400'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tarif Statusi</span>
          </div>
          <p className={`text-lg sm:text-xl font-black ${hasSubscription ? tierInfo.textColor : 'text-gray-900 dark:text-white'}`}>
            {tierInfo.title}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {tierInfo.label}
          </p>
        </div>

        {/* 2. To'lov Qilingan Sana */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4 text-brand-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">To'langan Sana</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
            {hasSubscription ? formatDate(user?.subscription?.start_date) : '—'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {hasSubscription ? 'Muvaffaqiyatli faollashgan' : 'Obuna yo\'q'}
          </p>
        </div>

        {/* 3. Amal Qilish Muddati */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Amal Qilish Muddati</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
            {hasSubscription ? formatDate(user?.subscription?.end_date) : 'Cheklanmagan'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {hasSubscription ? 'Shu sanagacha to\'liq ochiq' : 'HTML ochiq'}
          </p>
        </div>

        {/* 4. Qolgan Muddat */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <Hourglass className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Qolgan Muddat</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-mono">
            {hasSubscription ? `${daysLeft} kun qoldi` : '0 kun'}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {hasSubscription ? 'Har kuni 1 kun kamayadi' : 'Obuna kerak'}
          </p>
        </div>
      </div>

      {/* Visual Progress Bar */}
      {hasSubscription && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Faollashgan: <strong className="text-gray-900 dark:text-white font-mono">{formatDate(user?.subscription?.start_date)}</strong> ({elapsedDays} kun o'tdi)
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              Tugash: <strong className={`font-mono ${tierInfo.textColor}`}>{formatDate(user?.subscription?.end_date)}</strong> ({daysLeft} kun qoldi)
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                tierInfo.tier === 'Ultra' ? 'from-amber-500 via-orange-500 to-yellow-400' :
                tierInfo.tier === 'Pro' ? 'from-brand-600 via-emerald-500 to-teal-400' :
                'from-blue-600 via-indigo-500 to-cyan-400'
              }`}
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Jami davomiylik: {totalDays} kun</span>
            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{progressPercent}% muddat yakunlandi</span>
          </div>
        </div>
      )}

      {/* Navbatdagi Rejalashtirilgan Tarif */}
      {nextSub && nextTierInfo && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-purple-500/[0.05] to-emerald-500/[0.08] border border-amber-500/30 dark:border-amber-400/25 shadow-lg relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${nextTierInfo.accentBg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <nextTierInfo.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Navbatdagi Tarif
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Navbatda kutilmoqda
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {nextTierInfo.title} ({nextTierInfo.label})
                </h3>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block">Avtomatik faollashish sanasi:</span>
              <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatDate(nextSub.start_date)} da
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/40 border border-amber-500/20 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Joriy <strong>{tierInfo.title}</strong> tarifi tugashi bilan (<strong className="font-mono text-gray-900 dark:text-white">{formatDate(user?.subscription?.end_date)}</strong>), ushbu <strong>{nextTierInfo.title}</strong> tarifi avtomatik tarzda soniyasida ishga tushadi va <strong className="font-mono text-gray-900 dark:text-white">{formatDate(nextSub.end_date)}</strong> gacha davom etadi. Hech bir kuningiz kuyib ketmaydi va to'xtalishsiz davom etadi!
            </span>
          </div>
        </div>
      )}

      {/* Obunaning Faol Imtiyozlari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="font-medium">Barcha 4 ta kurs to'liq ochiq</span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="font-medium">Yopiq VIP Telegram mentorligi</span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="font-medium">Interaktiv kod muharriri (IDE)</span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="font-medium">20 ta savolli Yakuniy Imtihonlar</span>
        </div>
      </div>

      {/* Harakat Tugmasi */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {hasSubscription 
            ? 'Obuna muddati tugashidan oldin yangi tarif xarid qilsangiz, u joriy tarifingiz tugashi bilan navbatma-navbat ulanadi.'
            : 'Pullik obuna orqali barcha ilg\'or kurslar, topshiriqlar va mentorlikka ega bo\'ling.'}
        </p>

        <button
          type="button"
          onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>{hasSubscription ? 'Tarifni Uzaytirish / Yangilash' : 'Obunani Faollashtirish'}</span>
        </button>
      </div>
    </div>
  );
};
