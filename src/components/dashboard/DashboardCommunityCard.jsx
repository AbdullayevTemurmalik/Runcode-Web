import React from 'react';
import { Send, Loader2, Lock } from 'lucide-react';

export const DashboardCommunityCard = ({
  hasSubscription,
  handleGetCommunityLink,
  communityLoading,
  communityLink,
  communityError,
  onOpenPaymentModal,
  navigate
}) => {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Yopiq Telegram Jamiyati & Middle Mentorlik
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Bu yerda har kuni tajribali middle dasturchilar sizning kodingizdagi xatolarni ko'rib chiqishadi, portfolio loyihalaringizga feedback berishadi va savollaringizga to'liq javob berishadi.
          </p>
        </div>

        <div>
          {hasSubscription ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGetCommunityLink}
                disabled={communityLoading}
                className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {communityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Telegram Guruhiga Kirish</span>
              </button>
              {communityLink && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                  Havola ochildi!
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-3 text-xs">
              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">
                Faqat aktiv pullik obunachilar uchun ochiq
              </span>
              <button
                onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Obuna bo'lish
              </button>
            </div>
          )}
        </div>
      </div>

      {communityError && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs">
          {communityError}
        </div>
      )}
    </div>
  );
};
