import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Crown, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const HomePricingSection = ({
  plansToDisplay,
  activePlanIndex,
  setActivePlanIndex,
  carouselRef,
  cardRefs,
  handlePrevPlan,
  handleNextPlan,
  onOpenPaymentModal
}) => {
  return (
    <section id="pricing" className="container-custom">
      
      {/* Section Header with Beautiful Text */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest">
          <CreditCard className="w-3.5 h-3.5 text-brand-500" />
          <span>Hamyonbop va Shaffof Obuna</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          O'zingizga Mos Tarif Rejasini Tanlang
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          HTML kursi har doim Free (Bepul). Qolgan barcha chuqur darslar va yopiq Telegram mentorlik guruhi uchun Plus, Pro yoki Ultra tariflaridan birini tanlang.
        </p>

        {/* Plan Navigation Controls (Faqat mobil va planshetda < > tugmalari, kompyuterda yo'q) */}
        <div className="lg:hidden flex items-center justify-center space-x-3 pt-4">
          <button
            type="button"
            onClick={handlePrevPlan}
            disabled={activePlanIndex === 0}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/10 hover:border-brand-500 text-gray-700 dark:text-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            aria-label="Oldingi tarif"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5">
            {plansToDisplay[activePlanIndex]?.name || `${activePlanIndex + 1} / ${plansToDisplay.length}`}
          </span>

          <button
            type="button"
            onClick={handleNextPlan}
            disabled={activePlanIndex === plansToDisplay.length - 1}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/10 hover:border-brand-500 text-gray-700 dark:text-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            aria-label="Keyingi tarif"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Responsive Plans Container (Kompyuterda 4 ta card bir qatorda yonma-yon, mobilda silliq swipe) */}
      <div 
        ref={carouselRef}
        className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none scroll-smooth no-scrollbar gap-6 py-6 px-1 items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {plansToDisplay.map((plan, idx) => {
          const isUltra = plan.id === '3_months' || plan.tier === 'Ultra';
          const isProPlus = plan.id === '2_months' || plan.tier === 'Pro+' || plan.name?.includes('Pro+');
          const isPro = plan.id === '1_month' || (plan.tier === 'Pro' && !isProPlus);
          const isPlus = plan.id === '7_days' || plan.tier === 'Plus';
          const isSelected = activePlanIndex === idx;

          return (
            <div
              key={plan.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              onClick={() => setActivePlanIndex(idx)}
              className={`snap-center flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-full lg:max-w-none rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 cursor-pointer ${
                isProPlus
                  ? 'bg-white dark:bg-[#0a1510] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20'
                  : isUltra
                  ? 'bg-white dark:bg-[#130d1c] border-2 border-purple-500/80 shadow-xl shadow-purple-500/10'
                  : isPro
                  ? 'bg-white dark:bg-[#0c1220] border-2 border-blue-500/60 shadow-lg shadow-blue-500/15'
                  : 'bg-white dark:bg-[#081520] border-2 border-sky-400/60 shadow-lg shadow-sky-500/10'
              } ${isSelected ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-[#080c14]' : ''}`}
            >
              {isPlus && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-sky-500/30 whitespace-nowrap">
                  <Star className="w-3 h-3 mr-1 fill-white" /> Test Uchun Sinang
                </div>
              )}

              {isProPlus && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                  <Star className="w-3 h-3 mr-1 fill-white" /> Tavsiya Etiladi
                </div>
              )}

              {isUltra && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-purple-500/30 whitespace-nowrap">
                  <Crown className="w-3 h-3 mr-1 fill-white" /> Super Tejam
                </div>
              )}

              <div>
                {/* Tier Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isPlus
                      ? 'bg-sky-500/15 text-sky-500 border border-sky-500/25'
                      : isPro
                      ? 'bg-blue-500/15 text-blue-500 border border-blue-500/25'
                      : isProPlus
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/25'
                  }`}>
                    {plan.statusTitle || plan.name} Status
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">{plan.duration}</span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{plan.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{plan.desc || plan.description}</p>

                <div className="my-6 pb-6 border-b border-gray-100 dark:border-white/5">
                  <span className={`text-3xl font-black tracking-tight ${
                    isPlus ? 'text-sky-600 dark:text-sky-400' :
                    isPro ? 'text-blue-600 dark:text-blue-400' :
                    isProPlus ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`}>
                    {plan.price}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imkoniyatlar:</p>
                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                    {(plan.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          isPlus ? 'text-sky-500' :
                          isPro ? 'text-blue-500' :
                          isProPlus ? 'text-emerald-500' :
                          'text-purple-500'
                        }`} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => onOpenPaymentModal && onOpenPaymentModal(plan.id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                    isProPlus
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900'
                      : isUltra
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                      : isPro
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                      : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{plan.ctaText || 'Obuna Bo\'lish'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
