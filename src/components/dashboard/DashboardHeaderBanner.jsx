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
    <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-[#0b0f19] border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none ${
        tierInfo.tier === 'Ultra' ? 'bg-amber-500' : tierInfo.tier === 'Pro' ? 'bg-emerald-500' : 'bg-blue-500'
      }`} />

      <div className="flex items-center space-x-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-400 flex items-center justify-center font-black text-2xl shadow-inner">
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight">{user?.fullName}</h1>
            {hasSubscription && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${tierInfo.badgeColor} border`}>
                <TierIcon className="w-3 h-3 mr-1" />
                {tierInfo.title}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 flex items-center mt-1">
            <Mail className="w-3.5 h-3.5 mr-1 text-gray-500" />
            {user?.email || 'Email kiritilmagan'}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        {hasSubscription ? (
          <div className={`px-4 py-2.5 rounded-2xl bg-black/40 border ${tierInfo.borderGlow} backdrop-blur-md flex items-center space-x-3 shadow-lg`}>
            <div className={`w-10 h-10 rounded-xl ${tierInfo.accentBg} flex items-center justify-center font-bold`}>
              <TierIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-xs font-black uppercase tracking-wider ${tierInfo.textColor}`}>
                  {tierInfo.title}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-semibold text-gray-300">
                {daysLeft} kun qoldi • {formatDate(user?.subscription?.end_date)} gacha
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Obunani Faollashtirish</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/80 hover:bg-rose-950/40 hover:border-rose-700/60 text-gray-300 hover:text-rose-400 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};
