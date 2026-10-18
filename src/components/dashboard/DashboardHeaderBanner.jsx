import React from 'react';
import { Mail, CreditCard, LogOut } from 'lucide-react';

export const DashboardHeaderBanner = ({
  user,
  hasSubscription,
  tierInfo,
  daysLeft,
  formatDate,
  onOpenPaymentModal,
  navigate,
  setIsLogoutModalOpen
}) => {
  const TierIcon = tierInfo.icon;

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#0b0f19] border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-xl relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none ${
        tierInfo.tier === 'Max' || tierInfo.tier === 'Ultra' ? 'bg-purple-500' : tierInfo.tier === 'Pro+' ? 'bg-emerald-500' : tierInfo.tier === 'Pro' ? 'bg-blue-500' : 'bg-sky-500'
      }`} />

      <div className="flex items-center space-x-3 sm:space-x-4 relative z-10">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-lg sm:text-2xl shadow-inner flex-shrink-0">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <h1 className="text-base sm:text-2xl font-bold tracking-tight truncate">{user?.fullName}</h1>
            {hasSubscription && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${tierInfo.badgeColor} border`}>
                <TierIcon className="w-3 h-3 mr-1" />
                {tierInfo.title}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
            {/* Odamga yaqqol ko'rinadigan ID raqami (@RunCodeVerifyBot uchun) */}
            <div 
              title="Sizning RunCode ID raqamingiz (@RunCodeVerifyBot uchun)"
              className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-xl bg-brand-500/15 border border-brand-500/35 shadow-sm ring-1 ring-brand-500/20"
            >
              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-gray-400">ID:</span>
              <span className="text-xs sm:text-base font-black font-mono tracking-wider text-brand-300">
                #{user?.id}
              </span>
            </div>

            <p className="text-xs text-gray-400 flex items-center truncate">
              <Mail className="w-3.5 h-3.5 mr-1 text-gray-500 flex-shrink-0" />
              <span className="truncate">{user?.email || 'Email kiritilmagan'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
        {hasSubscription ? (
          <div className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-black/40 border ${tierInfo.borderGlow} backdrop-blur-md flex items-center space-x-3 shadow-lg flex-1 sm:flex-initial`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${tierInfo.accentBg} flex items-center justify-center font-bold flex-shrink-0`}>
              <TierIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className={`text-xs font-black uppercase tracking-wider truncate ${tierInfo.textColor}`}>
                  {tierInfo.title}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-300 truncate">
                {daysLeft} kun qoldi • {formatDate(user?.subscription?.end_date)} gacha
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Obunani Faollashtirish</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-rose-950/40 hover:border-rose-700/60 text-gray-300 hover:text-rose-400 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};
