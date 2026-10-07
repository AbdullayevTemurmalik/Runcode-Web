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
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PLANS = [
  {
    id: 'free',
    tier: 'Free',
    name: 'Free (Bepul)',
    statusTitle: 'Free',
    duration: 'Cheksiz muddat',
    price: '0 so\'m',
    amount: 0,
    desc: 'Dasturlash olamiga ilk qadam qo\'yuvchilar uchun',
    features: [
      '11 ta to\'liq HTML darsliklari',
      'Barcha amaliy topshiriqlar',
      'Interaktiv kod muharriri va amaliy mashqlar',
      'Barcha mavzular bo\'yicha testlar',
      'Platformadan cheksiz foydalanish'
    ],
    notIncluded: [
      'CSS, JavaScript va React kurslari',
      'Yopiq Telegram mentorlik guruhi'
    ],
    ctaText: 'Bepul Boshlash',
    isFree: true,
    recommended: false
  },
  {
    id: '1_month',
    tier: 'Plus',
    name: 'Plus',
    statusTitle: 'Plus',
    duration: '1 oy to\'liq ochiq',
    price: '50 000 so\'m',
    amount: 50000,
    desc: 'Tez sur\'atda chuqur bilim oluvchilar uchun',
    features: [
      'Barcha 4 ta kurs: HTML, CSS, JS, React',
      '73 ta interaktiv amaliy darslik',
      'Har bir kurs uchun mustaqil amaliy loyihalar',
      'Yopiq Telegram guruhiga a\'zolik',
      'Har kuni middle dasturchilar konsultatsiyasi'
    ],
    notIncluded: [],
    ctaText: 'Plus Obuna',
    isFree: false,
    recommended: false
  },
  {
    id: '2_months',
    tier: 'Pro',
    name: 'Pro',
    statusTitle: 'Pro',
    duration: '2 oy to\'liq ochiq',
    price: '90 000 so\'m',
    amount: 90000,
    desc: 'Frontend dasturchi bo\'lish uchun eng optimal reja',
    features: [
      'Barcha 4 ta kurs: HTML, CSS, JS, React',
      '73 ta amaliy darslik va manbalar',
      '10 000 so\'m kafolatlangan tejam',
      'Barcha 4 ta yo\'nalish bo\'yicha real portfolio loyihalar',
      'Yopiq Telegram VIP guruhida doimiy yordam',
      'Imtihonlarni qayta topshirish imkoniyati'
    ],
    notIncluded: [],
    ctaText: 'Pro Obuna',
    isFree: false,
    recommended: true
  },
  {
    id: '3_months',
    tier: 'Ultra',
    name: 'Ultra',
    statusTitle: 'Ultra',
    duration: '3 oy to\'liq ochiq',
    price: '120 000 so\'m',
    amount: 120000,
    desc: 'Maksimal tejamkorlik va to\'liq Full-Stack tayyorgarlik',
    features: [
      'Barcha mavjud 4 ta kurs va yangi modullar',
      '30 000 so\'m kafolatlangan tejam',
      'Kelgusi Node.js & Next.js modullariga kirish',
      'Yangi chiqadigan barcha amaliy darslar',
      'VIP Telegram mentorlik guruhi (24/7 yordam)',
      'Shaxsiy portfolio loyihalar tahlili (Code Review)'
    ],
    notIncluded: [],
    ctaText: 'Ultra Obuna',
    isFree: false,
    recommended: false
  }
];

export const TariffsPage = ({ onOpenPaymentModal }) => {
  const { hasSubscription, user } = useAuth();
  const [pricingPlans, setPricingPlans] = useState(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const res = await api.get('/payments/config');
        if (res && res.success && res.plans) {
          setPricingPlans(Object.values(res.plans));
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
    { title: 'HTML Dasturlash Asoslari (11 dars)', free: true, plus: true, pro: true, ultra: true },
    { title: 'CSS & Responsive Dizayn (19 dars)', free: false, plus: true, pro: true, ultra: true },
    { title: 'JavaScript Chuqur Kurs (28 dars)', free: false, plus: true, pro: true, ultra: true },
    { title: 'React.js Zamonaviy Ekotizim (15 dars)', free: false, plus: true, pro: true, ultra: true },
    { title: 'Kelgusi Node.js & Next.js modullari', free: false, plus: false, pro: false, ultra: true },
    { title: 'Yopiq Telegram Jamiyati & Mentorlik', free: false, plus: true, pro: true, ultra: 'VIP guruh + 24/7' },
    { title: 'Interaktiv Kod Muharriri & Sandbox', free: true, plus: true, pro: true, ultra: true },
    { title: 'Foydalanuvchi Profili Statusi', free: 'Free Status', plus: 'Plus Status', pro: 'Pro Status', ultra: 'Ultra Status' },
    { title: 'Kafolatlangan Tejam', free: '—', plus: '—', pro: '10 000 so\'m', ultra: '30 000 so\'m' },
  ];

  const handlePlanClick = (plan) => {
    if (plan.isFree) return;
    if (onOpenPaymentModal) {
      onOpenPaymentModal(plan.id);
    }
  };

  return (
    <div className="py-12 sm:py-20 space-y-20">
      
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
          HTML kursi har doim mutlaqo bepul. CSS, JavaScript va React yo'nalishlariga kirish hamda platformadagi maqomingizni (Free, Plus, Pro, Ultra) belgilash uchun o'zingizga qulay tarifni tanlang.
        </p>

        {hasSubscription && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Sizda hozirda aktiv obuna mavjud! Yangi tarif tanlasangiz, joriy obunangizga qo'shilib uzaytiriladi va profilingiz yangi statusga ega bo'ladi.</span>
          </div>
        )}
      </div>

      {/* 2. Pricing Cards */}
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
          {displayPlans.map((plan) => {
              const isPro = plan.id === '2_months' || plan.tier === 'Pro';
              const isUltra = plan.id === '3_months' || plan.tier === 'Ultra';
              const isPlus = plan.id === '1_month' || plan.tier === 'Plus';
              const isFree = plan.isFree;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                    isPro
                      ? 'bg-white dark:bg-[#0f111a] border-2 border-brand-500 shadow-2xl shadow-brand-500/20'
                      : isUltra
                      ? 'bg-white dark:bg-[#0d0f17] border-2 border-purple-500/80 shadow-xl shadow-purple-500/10'
                      : 'bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 shadow-sm'
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center shadow-lg shadow-brand-500/30 whitespace-nowrap">
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
                        isFree 
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-500' 
                          : isPlus 
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : isPro
                          ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {plan.statusTitle || plan.name} Status
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{plan.duration}</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3">{plan.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{plan.desc || plan.description}</p>

                    <div className="my-6 pb-6 border-b border-gray-100 dark:border-white/5">
                      <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {plan.price}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imkoniyatlar:</p>
                      <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                        {(plan.features || []).map((feat, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                        {(plan.notIncluded || []).map((feat, i) => (
                          <li key={i} className="flex items-start space-x-2 text-gray-400 line-through opacity-60">
                            <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/5">
                    {plan.isFree ? (
                      <Link
                        to="/courses/html"
                        className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>{plan.ctaText || 'Bepul Boshlash'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlanClick(plan)}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                          isPro
                            ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-900'
                            : isUltra
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{plan.ctaText || 'Obunani Faollashtirish'}</span>
                      </button>
                    )}
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
                  <th className="py-3 px-3 text-center font-bold">Free</th>
                  <th className="py-3 px-3 text-center font-bold">Plus</th>
                  <th className="py-3 px-3 text-center font-bold text-brand-500">Pro</th>
                  <th className="py-3 px-3 text-center font-bold text-purple-400">Ultra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {row.title}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.plus === 'boolean' ? (
                        row.plus ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">{row.plus}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="w-4 h-4 text-brand-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-brand-500">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {typeof row.ultra === 'boolean' ? (
                        row.ultra ? <Check className="w-4 h-4 text-purple-500 mx-auto" /> : <X className="w-4 h-4 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-purple-400">{row.ultra}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="container-custom max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-brand-500 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tez-tez beriladigan savollar</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "HTML kursi haqiqatdan ham bepulmi?",
              a: "Ha! HTML darslarimiz har qanday foydalanuvchi uchun mutlaqo bepul. Siz istalgan vaqtda kursni boshlashingiz, interaktiv kod muharririda topshiriqlarni bajarishingiz va imtihondan o'tib o'z bilimlaringizni sinashingiz mumkin."
            },
            {
              q: "Obuna muddati tugagach nima bo'ladi?",
              a: "Obuna muddati tugaganida siz yana Free maqomiga qaytasiz va HTML kursidan foydalanishda davom etishingiz mumkin. Barcha topshirgan imtihon natijalaringiz va o'qish tarixingiz tizimda abadiy saqlanadi."
            },
            {
              q: "To'lov qanday tasdiqlanadi?",
              a: "To'lovni boshlash tugmasini bosganingizda rasmiy karta raqami chiqadi va 30 daqiqalik (bankomat orqali 60 daqiqalik) taymer ishga tushadi. Chek rasmini yuklaganingizdan so'ng, admin moderatsiyasi orqali tezda tasdiqlanadi va obunangiz faollashadi."
            }
          ].map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
