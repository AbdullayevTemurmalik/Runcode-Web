import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Zap,
  Check,
  X,
  Loader2,
  Crown,
  Layers,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PromocodeInputBox } from '../components/PromocodeInputBox';
import { useActivePromocode } from '../hooks/useActivePromocode';

const DEFAULT_PLANS = [
  {
    id: '7_days',
    tier: 'Test Plus',
    name: 'Test Plus (7 Kunlik)',
    statusTitle: 'Test Plus',
    duration: '7 kun to\'liq ochiq',
    originalPrice: '25 000 so\'m',
    originalAmount: 25000,
    price: '15 000 so\'m',
    amount: 15000,
    desc: 'Test uchun sinang va platformaning barcha imkoniyatlarini sinovdan o\'tkazing',
    badge: 'TEST PLUS',
    features: [
      'Barcha 4 ta kurs: HTML, CSS, JS, React',
      '73 ta interaktiv amaliy darslik',
      'Interaktiv kod muharriri va mashqlar',
      'Barcha mavzular bo\'yicha testlar',
      'Yopiq Telegram mentorlik guruhi'
    ],
    notIncluded: [],
    ctaText: 'Test Plus Obuna',
    isFree: false,
    recommended: false
  },
  {
    id: '1_month',
    tier: 'Pro',
    name: 'Pro (1 Oylik)',
    statusTitle: 'Pro',
    duration: '1 oy to\'liq ochiq',
    originalPrice: '60 000 so\'m',
    originalAmount: 60000,
    price: '40 000 so\'m',
    amount: 40000,
    desc: 'Tez sur\'atda chuqur bilim oluvchilar uchun optimal reja',
    badge: 'PRO',
    features: [
      'Barcha 4 ta kurs: HTML, CSS, JS, React',
      '73 ta interaktiv amaliy darslik',
      'Har bir kurs uchun mustaqil amaliy loyihalar',
      'Yopiq Telegram guruhiga a\'zolik',
      'Har kuni middle dasturchilar konsultatsiyasi'
    ],
    notIncluded: [],
    ctaText: 'Pro Obuna',
    isFree: false,
    recommended: false
  },
  {
    id: '2_months',
    tier: 'Pro+',
    name: 'Pro+ (2 Oylik)',
    statusTitle: 'Pro+',
    duration: '2 oy to\'liq ochiq',
    originalPrice: '100 000 so\'m',
    originalAmount: 100000,
    price: '70 000 so\'m',
    amount: 70000,
    desc: 'Frontend dasturchi bo\'lish uchun eng tavsiya etilgan reja',
    badge: 'PRO+ • TAVSIYA',
    features: [
      'Barcha 4 ta kurs: HTML, CSS, JS, React',
      '73 ta amaliy darslik va manbalar',
      '10 000 so\'m kafolatlangan tejam',
      'Barcha 4 ta yo\'nalish bo\'yicha real portfolio loyihalar',
      'Yopiq Telegram VIP guruhida doimiy yordam',
      'Imtihonlarni qayta topshirish imkoniyati'
    ],
    notIncluded: [],
    ctaText: 'Pro+ Obuna',
    isFree: false,
    recommended: true
  },
  {
    id: '3_months',
    tier: 'Max',
    name: 'Max (3 Oylik)',
    statusTitle: 'Max',
    duration: '3 oy to\'liq ochiq',
    originalPrice: '140 000 so\'m',
    originalAmount: 140000,
    price: '100 000 so\'m',
    amount: 100000,
    desc: 'Maksimal tejamkorlik va to\'liq professional tayyorgarlik',
    badge: 'MAX',
    features: [
      'Barcha mavjud 4 ta kurs va yangi modullar',
      '30 000 so\'m kafolatlangan tejam',
      'Kelgusi Node.js & Next.js modullariga kirish',
      'Yangi chiqadigan barcha amaliy darslar',
      'VIP Telegram mentorlik guruhi (24/7 yordam)',
      'Shaxsiy portfolio loyihalar tahlili (Code Review)'
    ],
    notIncluded: [],
    ctaText: 'Max Obuna',
    isFree: false,
    recommended: false,
    superSaver: true
  }
];

export const TariffsPage = ({ onOpenPaymentModal }) => {
  const { hasSubscription, user } = useAuth();
  const [pricingPlans, setPricingPlans] = useState(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const res = await api.get('/payments/config');
        if (res && res.success && res.plans) {
          const list = Object.values(res.plans).filter(p => !p.isFree && p.id !== 'free');
          if (list.length > 0) {
            setPricingPlans(list);
          }
        }
      } catch (err) {
        console.error('Tariflarni yuklashda xatolik:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const displayPlans = pricingPlans.length > 0 ? pricingPlans : DEFAULT_PLANS;

  const comparisonRows = [
    { title: 'HTML Dasturlash Asoslari (11 dars)', plus: true, pro: true, proPlus: true, max: true },
    { title: 'CSS & Responsive Dizayn (19 dars)', plus: true, pro: true, proPlus: true, max: true },
    { title: 'JavaScript Chuqur Kurs (28 dars)', plus: true, pro: true, proPlus: true, max: true },
    { title: 'React.js Zamonaviy Ekotizim (15 dars)', plus: true, pro: true, proPlus: true, max: true },
    { title: 'Kelgusi Node.js & Next.js modullari', plus: false, pro: false, proPlus: false, max: true },
    { title: 'Yopiq Telegram Jamiyati & Mentorlik', plus: '7 kun', pro: '1 oy', proPlus: '2 oy (VIP)', max: '3 oy (VIP + 24/7)' },
    { title: 'Interaktiv Kod Muharriri & Sandbox', plus: true, pro: true, proPlus: true, max: true },
    { title: 'Foydalanuvchi Profili Statusi', plus: 'Test Plus Status', pro: 'Pro Status', proPlus: 'Pro+ Status', max: 'Max Status' },
    { title: 'Kafolatlangan Tejam', plus: 'TEST PLUS', pro: '—', proPlus: '10 000 so\'m', max: '30 000 so\'m' },
  ];

  const handlePlanClick = (plan) => {
    if (plan.isFree) return;
    if (onOpenPaymentModal) {
      onOpenPaymentModal(plan.id);
    }
  };

  const { getPlanPricing } = useActivePromocode();

  return (
    <div className="py-12 sm:py-20 space-y-16">
      
      {/* 1. Header */}
      <div className="container-custom text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide">
          <CreditCard className="w-4 h-4 text-brand-500" />
          <span>Shaffof va Qulay Tariflar</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Zamonaviy ta'lim uchun <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-400">adolatli narxlar</span>
        </h1>
        
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          HTML kursi har doim mutlaqo bepul. CSS, JavaScript va React yo'nalishlariga kirish hamda platformadagi maqomingizni (Free, Test Plus, Pro, Pro+, Max) belgilash uchun o'zingizga qulay tarifni tanlang.
        </p>

        {hasSubscription && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Sizda hozirda aktiv obuna mavjud! Yangi tarif tanlasangiz, joriy obunangizga qo'shilib uzaytiriladi va profilingiz yangi statusga ega bo'ladi.</span>
          </div>
        )}
      </div>

      {/* Promokod Kiritish va Live Countdown Timer Bo'limi */}
      <div className="container-custom -my-6">
        <PromocodeInputBox />
      </div>

      {/* 2. Pricing Cards */}
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
          {displayPlans.map((plan) => {
              const isMax = plan.id === '3_months' || plan.tier === 'Max' || plan.tier === 'Ultra' || plan.name?.toLowerCase().includes('max') || plan.name?.toLowerCase().includes('ultra');
              const isProPlus = plan.id === '2_months' || plan.tier === 'Pro+' || plan.name?.includes('Pro+');
              const isPro = plan.id === '1_month' || ((plan.tier === 'Pro' || plan.name?.includes('Pro')) && !isProPlus);
              const isPlus = plan.id === '7_days' || plan.tier === 'Plus' || plan.tier === 'Test Plus' || plan.name?.toLowerCase().includes('plus');
              const pricing = getPlanPricing(plan.id, plan.price, plan.originalPrice);

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                    isProPlus
                      ? 'bg-white dark:bg-[#0a1510] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20'
                      : isMax
                      ? 'bg-white dark:bg-[#130d1c] border-2 border-purple-500/80 shadow-xl shadow-purple-500/10'
                      : isPro
                      ? 'bg-white dark:bg-[#0c1220] border-2 border-blue-500/60 shadow-lg shadow-blue-500/15'
                      : 'bg-white dark:bg-[#081520] border-2 border-sky-400/60 shadow-lg shadow-sky-500/10'
                  }`}
                >
                  {isPlus && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-sky-500/30 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 mr-1 fill-white" /> TEST PLUS
                    </div>
                  )}

                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-blue-500/30 whitespace-nowrap">
                      <Star className="w-3 h-3 mr-1 fill-white" /> PRO
                    </div>
                  )}

                  {isProPlus && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                      <Star className="w-3 h-3 mr-1 fill-white" /> PRO+ • TAVSIYA
                    </div>
                  )}

                  {isMax && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-purple-500/30 whitespace-nowrap">
                      <Crown className="w-3 h-3 mr-1 fill-white" /> MAX
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
                        {plan.statusTitle || (isMax ? 'Max' : isProPlus ? 'Pro+' : isPro ? 'Pro' : 'Test Plus')} Status
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{plan.duration}</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{plan.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{plan.desc || plan.description}</p>

                    <div className="my-6 pb-6 border-b border-gray-100 dark:border-white/5">
                      <div className="flex flex-col space-y-1">
                        {/* Strikethrough Eski Narxlar */}
                        <div className="flex items-center space-x-2 flex-wrap">
                          {pricing.isDiscounted ? (
                            <>
                              {pricing.superOriginalPrice && (
                                <span className="text-xs sm:text-sm font-semibold line-through text-gray-400 dark:text-gray-500">
                                  {pricing.superOriginalPrice}
                                </span>
                              )}
                              <span className="text-sm sm:text-base font-bold line-through text-gray-400 dark:text-gray-400">
                                {pricing.strikethroughPrice}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                                {pricing.badgeText}
                              </span>
                            </>
                          ) : (
                            pricing.strikethroughPrice && (
                              <span className="text-base sm:text-lg font-bold line-through text-gray-400 dark:text-gray-500">
                                {pricing.strikethroughPrice}
                              </span>
                            )
                          )}

                          {pricing.isExcluded && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                              Chegirma yo'q
                            </span>
                          )}
                        </div>

                        {/* Joriy Narx */}
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <span className={`text-3xl font-black tracking-tight ${
                            pricing.isDiscounted 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : isPlus ? 'text-sky-600 dark:text-sky-400' :
                                isPro ? 'text-blue-600 dark:text-blue-400' :
                                isProPlus ? 'text-emerald-600 dark:text-emerald-400' :
                                'text-purple-600 dark:text-purple-400'
                          }`}>
                            {pricing.currentPrice}
                          </span>
                        </div>
                      </div>
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
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                        isProPlus
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900'
                          : isMax
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                          : isPro
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                          : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{plan.ctaText || 'Obunani Faollashtirish'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
      </div>

      {/* 3. Comparison Table */}
      <div className="container-custom">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 p-6 sm:p-10 shadow-sm overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Tariflar va Statuslar Taqqoslovi
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Har bir reja bo'yicha imkoniyatlar va olingan status bilan batafsil tanishing
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400">
                  <th className="py-3 px-4 font-bold">Imkoniyat</th>
                  <th className="py-3 px-3 text-center font-bold text-sky-500">Test Plus (7 kun)</th>
                  <th className="py-3 px-3 text-center font-bold text-blue-500">Pro (1 oy)</th>
                  <th className="py-3 px-3 text-center font-bold text-emerald-500">Pro+ (2 oy)</th>
                  <th className="py-3 px-3 text-center font-bold text-purple-400">Max (3 oy)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {row.title}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.plus === 'boolean' ? (
                        row.plus ? <Check className="w-4 h-4 text-sky-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold text-sky-500">{row.plus}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold text-blue-500">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.proPlus === 'boolean' ? (
                        row.proPlus ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-emerald-500">{row.proPlus}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.max === 'boolean' ? (
                        row.max ? <Check className="w-4 h-4 text-purple-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-purple-400">{row.max}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. FAQ - Tez-tez beriladigan savollar */}
      <div className="container-custom max-w-xl mx-auto space-y-6 pt-4 pb-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[11px] font-bold uppercase tracking-wider border border-brand-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Yordam va Savollar</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Tez-tez beriladigan savollar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            HTML kursi, obuna shartlari va to'lov tasdiqlanishi bo'yicha eng muhim ma'lumotlar.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'faq-html',
              icon: Sparkles,
              iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
              q: "HTML kursi haqiqatdan ham bepulmi?",
              a: "Ha! HTML darslarimiz har qanday foydalanuvchi uchun mutlaqo bepul. Siz istalgan vaqtda kursni boshlashingiz, interaktiv kod muharririda topshiriqlarni bajarishingiz va imtihondan o'tib o'z bilimlaringizni sinashingiz mumkin."
            },
            {
              id: 'faq-sub',
              icon: Clock,
              iconBg: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
              q: "Obuna muddati tugagach nima bo'ladi?",
              a: "Obuna muddati tugaganida siz yana Free maqomiga qaytasiz va HTML kursidan foydalanishda davom etishingiz mumkin. Barcha topshirgan imtihon natijalaringiz va o'qish tarixingiz tizimda abadiy saqlanadi."
            },
            {
              id: 'faq-payment',
              icon: CreditCard,
              iconBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
              q: "To'lov qanday tasdiqlanadi?",
              a: "To'lovni boshlash tugmasini bosganingizda rasmiy to'lov QR-kodi (Click Up yoki Uzum Bank) chiqadi va 30 daqiqalik taymer ishga tushadi. QR-kodni skanerlab yoki to'g'ridan-to'g'ri ilovada to'lab, chek rasmini yuklaganingizdan so'ng, admin moderatsiyasi orqali tezda tasdiqlanadi va obunangiz faollashadi."
            }
          ].map((faq, i) => {
            const isOpen = openFaqIndex === i;
            const Icon = faq.icon;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#101422] border-brand-500/40 shadow-lg shadow-brand-500/5 ring-1 ring-brand-500/20'
                    : 'bg-white/80 dark:bg-[#0c0d12]/80 border-gray-200/80 dark:border-white/5 hover:border-brand-500/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(prev => prev === i ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${faq.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-brand-500' : 'text-gray-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
