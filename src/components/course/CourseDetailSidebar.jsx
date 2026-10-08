import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Lock, 
  Clock 
} from 'lucide-react';

export const CourseDetailSidebar = ({
  isUpcoming,
  isPremium,
  hasSubscription,
  user,
  canAccess,
  handleStartCourse
}) => {
  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
      {/* To'liq Ruxsat Nishoni */}
      <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
        <ShieldCheck className="w-4 h-4 text-brand-500" />
        <span>To'liq ruxsat</span>
      </div>

      {/* Narx / Status */}
      <div className="pb-6 border-b border-gray-100 dark:border-white/5">
        {isUpcoming ? (
          <div>
            <span className="text-3xl font-black text-amber-500 tracking-tight">
              TEZ KUNDA
            </span>
            <p className="text-xs text-gray-400 mt-1">Ushbu kurs hozirda tayyorlanmoqda</p>
          </div>
        ) : !isPremium ? (
          <div>
            <span className="text-3xl font-black text-emerald-500 tracking-tight">
              BEPUL
            </span>
            <p className="text-xs text-gray-400 mt-1">100% mutlaqo bepul ochiq ta'lim</p>
          </div>
        ) : (
          <div>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              PREMIUM
            </span>
            <p className="text-xs text-brand-500 font-bold mt-1">
              {hasSubscription ? 'Sizda faol obuna mavjud' : 'Obuna orqali to\'liq ochiq'}
            </p>
          </div>
        )}
      </div>

      {/* Imkoniyatlar Ro'yxati */}
      <div className="space-y-3.5 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <span>Umrbod yoki faol obuna davomida cheksiz ruxsat</span>
        </div>
        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <span>Real amaliy loyihalar ustida ishlash</span>
        </div>
        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <span>Interaktiv browser kod muharriri (IDE)</span>
        </div>
        <div className="flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
          <span>Yopiq Telegram hamjamiyati va yordam (7/24)</span>
        </div>
      </div>

      {/* Katta CTA Tugma: Kursni boshlash */}
      <div className="pt-4">
        {isUpcoming ? (
          <button
            type="button"
            onClick={handleStartCourse}
            className="w-full py-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Tez Kunda Taqdim Etiladi</span>
          </button>
        ) : !user ? (
          <button
            type="button"
            onClick={handleStartCourse}
            className="w-full py-3.5 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Kirish va Boshlash</span>
          </button>
        ) : canAccess ? (
          <button
            type="button"
            onClick={handleStartCourse}
            className="w-full py-3.5 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Kursni boshlash</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartCourse}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-brand-500/20"
          >
            <Lock className="w-4 h-4" />
            <span>Obunani Faollashtirish</span>
          </button>
        )}
      </div>
    </div>
  );
};
