import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Terminal, 
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Send,
  Star,
  Lock,
  Unlock,
  Layers,
  Check,
  Crown,
  Globe
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { renderTechLogo } from '../components/TechLogos';

export const HomePage = ({ onOpenPaymentModal }) => {
  const { isAuthenticated, hasSubscription, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Swiper / Karusel holati (Free, Plus, Pro, Ultra)
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, paymentsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/payments/config')
        ]);
        if (coursesRes && coursesRes.success) {
          setCourses(coursesRes.courses || []);
        }
        if (paymentsRes && paymentsRes.success && paymentsRes.plans) {
          setPricingPlans(Object.values(paymentsRes.plans));
        }
      } catch (err) {
        console.error('Bosh sahifa ma\'lumotlarini yuklashda xatolik:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 8 ta rasmiy texnologiyalar ro'yxati
  const techStack = [
    { slug: 'html', name: 'HTML5' },
    { slug: 'css', name: 'CSS3' },
    { slug: 'javascript', name: 'JavaScript' },
    { slug: 'typescript', name: 'TypeScript' },
    { slug: 'react', name: 'React.js' },
    { slug: 'vue', name: 'Vue.js' },
    { slug: 'nodejs', name: 'Node.js' },
    { slug: 'next', name: 'Next.js' }
  ];

  // Default plans (Free, Plus, Pro, Ultra)
  const defaultPlans = [
    {
      id: 'free',
      tier: 'Free',
      name: 'Free (Bepul)',
      duration: 'Cheksiz muddat',
      price: '0 so\'m',
      desc: 'Dasturlash olamiga ilk qadam qo\'yuvchilar uchun',
      features: [
        '11 ta to\'liq HTML darsliklari',
        'Amaliy kodlash topshiriqlari',
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
      duration: '1 oy to\'liq ochiq',
      price: '50 000 so\'m',
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
      duration: '2 oy to\'liq ochiq',
      price: '90 000 so\'m',
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
      duration: '3 oy to\'liq ochiq',
      price: '120 000 so\'m',
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

  const plansToDisplay = pricingPlans.length > 0 ? pricingPlans : defaultPlans;

  const scrollToPlan = (index) => {
    setActivePlanIndex(index);
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handlePrevPlan = () => {
    const nextIdx = Math.max(0, activePlanIndex - 1);
    scrollToPlan(nextIdx);
  };

  const handleNextPlan = () => {
    const nextIdx = Math.min(plansToDisplay.length - 1, activePlanIndex + 1);
    scrollToPlan(nextIdx);
  };

  const handleCourseAction = (e, course) => {
    if (e) e.preventDefault();
    navigate(`/courses/${course.slug}`);
  };

  return (
    <div className="space-y-24 sm:space-y-36">
      
      {/* 1. HERO SECTION (Sammi.academy Uslubi) */}
      <section className="relative pt-10 sm:pt-16 pb-8 overflow-hidden">
        <div className="container-custom relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Platforma 2.0 ishga tushdi</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-500 ml-1" />
              </div>

              <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.08]">
                RunCode <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-400 to-teal-400">
                  Dasturlash Kurslari
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                Nol darajadan professionalgacha ko'tariling. Zamonaviy texnologiyalar bilan amaliy kod yozing, o'rganing va portfolio uchun kuchli loyihalar yarating.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={isAuthenticated ? "/courses" : "/login"}
                  state={isAuthenticated ? undefined : { message: "Kurslarni ko'rish va o'qish uchun avval tizimga kiring." }}
                  className="px-7 py-3.5 rounded-full bg-white text-gray-950 hover:bg-gray-100 font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Boshlash</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://t.me/TM_Backdev"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-full border border-gray-300 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-900/80 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-sky-500" />
                  <span>@TM_Backdev</span>
                </a>
              </div>

              {/* Real Metrics: 100+ O'quvchilar, 5+ Loyihalar, 8 ta Texnologiyalar */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-gray-200/60 dark:border-gray-800/60 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">100+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-brand-500" /> O'quvchilar
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">5+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1 text-brand-500" /> Loyihalar
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">8 ta</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1 text-brand-500" /> Texnologiyalar
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Modern Terminal Window (Sammi.academy Mockup) */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[#0c101b] border border-gray-800/80 shadow-2xl p-5 sm:p-6 text-left font-mono text-xs sm:text-sm space-y-4 relative overflow-hidden group">
                
                {/* Window Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 text-gray-500 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-gray-400 flex items-center">
                    <Terminal className="w-3.5 h-3.5 mr-1 text-gray-500" /> runcode-platform ~ bash
                  </span>
                </div>

                {/* Terminal Commands */}
                <div className="space-y-2 text-gray-300">
                  <p className="text-gray-400">
                    <span className="text-brand-400 font-bold">~$</span> runcode init --course fullstack
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    &gt; Texnologiyalar: [HTML, CSS, JavaScript, React, Node.js]
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    &gt; Loyihalar: 5+ amaliy portfolio loyihalari
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    &gt; Tizim tayyor: 100+ o'quvchi faol ta'lim olmoqda. <span className="animate-pulse">█</span>
                  </p>
                </div>

                {/* Simulated Success pill */}
                <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-brand-500" />
                    All systems operational
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 8 ta Texnologiyalar Satri */}
        <div className="container-custom mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            O'rganiladigan 8 ta asosiy zamonaviy texnologiya:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 items-center justify-center">
            {techStack.map((tech) => (
              <div 
                key={tech.slug}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#0c0d12]/60 border border-gray-200/60 dark:border-white/5 hover:border-brand-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {renderTechLogo(tech.slug, "w-7 h-7")}
                </div>
                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 mt-2">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SO'NGGI KURSLAR (Faqat Bazadagi Haqiqiy Kurslar & Qulf/Ochiq Statusi) */}
      <section className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>O'quv dasturlari</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              So'nggi Kurslar
            </h2>
          </div>

          <Link
            to={isAuthenticated ? "/courses" : "/login"}
            state={isAuthenticated ? undefined : { message: "Kurslarni ko'rish va o'qish uchun avval tizimga kiring." }}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Columns Grid of Dark Tech Cards - So'nggi 4 ta Kurs Bir Qatorda Tekis Joylashadi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
          {courses.map((c) => {
            const canAccess = !c.is_premium || hasSubscription;
            const levelText = c.slug === 'html' ? 'Boshlang\'ich' : c.slug === 'css' ? 'O\'rta daraja' : 'Murakkab';
            const categoryText = c.slug === 'html' ? 'Foundation' : 'Frontend';

            return (
              <div
                key={c.id}
                onClick={(e) => handleCourseAction(e, c)}
                className="cursor-pointer rounded-3xl bg-[#0f1422] border border-gray-800/80 p-5 xl:p-6 flex flex-col justify-between hover:border-brand-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-brand-500/10 transform hover:-translate-y-2 group"
              >
                <div>
                  {/* Card Header: Grid Pattern Texture with Tech Logo */}
                  <div className="relative rounded-2xl bg-[#0b0e17] border border-gray-800/60 p-8 flex items-center justify-center mb-5 overflow-hidden min-h-[140px]">
                    
                    {/* Subtle Grid Lines Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]" />

                    {/* Level Badge in Top Left */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-800/80 text-gray-300 border border-gray-700/60">
                      {levelText}
                    </span>

                    {/* Lock / Unlock Status Badge in Top Right */}
                    <div className="absolute top-3 right-3">
                      {!c.is_premium ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" /> Bepul
                        </span>
                      ) : canAccess ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center">
                          <Unlock className="w-3 h-3 mr-1" /> Ochiq (Obuna)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center">
                          <Lock className="w-3 h-3 mr-1" /> Qulflangan
                        </span>
                      )}
                    </div>

                    {/* Tech Logo */}
                    <div className="relative z-10 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                      {renderTechLogo(c.slug, "w-14 h-14")}
                    </div>
                  </div>

                  {/* Category & Online Badges */}
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-300 uppercase tracking-wider">
                      {categoryText}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>ONLINE</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mt-3 group-hover:text-brand-400 transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                </div>

                {/* Bottom Footer Info: 100+ o'quvchi & Darslar soni */}
                <div className="pt-6 border-t border-gray-800/60 mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-brand-500" />
                      {c.lesson_count || 12} ta dars
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1 text-gray-500" />
                      100+ o'quvchi
                    </span>
                  </div>

                  <div className="flex items-center">
                    {canAccess ? (
                      <span className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center transition-all duration-300 shadow-md shadow-brand-500/20 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:bg-brand-500 group-hover:shadow-lg group-hover:shadow-brand-500/40 hover:scale-125 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-500/50">
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold flex items-center space-x-1.5 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:bg-amber-500/30">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Obuna</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TARIFLAR VA STATUSLAR BO'LIMI (Swiper / Karusel Free, Plus, Pro, Ultra) */}
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

          {/* Plan Selector Tabs & Navigation */}
          <div className="space-y-4 pt-4">
            {/* Quick Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {plansToDisplay.map((plan, idx) => {
                const isSelected = activePlanIndex === idx;
                const isPro = plan.id === '2_months' || plan.tier === 'Pro';
                const isUltra = plan.id === '3_months' || plan.tier === 'Ultra';
                const isPlus = plan.id === '1_month' || plan.tier === 'Plus';
                const isFree = plan.isFree;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => scrollToPlan(idx)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? isPro
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105 ring-2 ring-brand-500'
                          : isUltra
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-purple-500'
                          : isPlus
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 ring-2 ring-blue-500'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-105 ring-2 ring-gray-400'
                        : 'bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-brand-500/50'
                    }`}
                  >
                    {isPro && <Star className="w-3.5 h-3.5 fill-current" />}
                    {isUltra && <Crown className="w-3.5 h-3.5 fill-current" />}
                    <span>{plan.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Arrows & Current Plan Badge */}
            <div className="flex items-center justify-center space-x-3">
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
        </div>

        {/* Responsive Plans Container (Desktop 4 cards side-by-side, mobile/tablet smooth swipe) */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-6 py-6 px-1 items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {plansToDisplay.map((plan, idx) => {
            const isPro = plan.id === '2_months' || plan.tier === 'Pro';
            const isUltra = plan.id === '3_months' || plan.tier === 'Ultra';
            const isPlus = plan.id === '1_month' || plan.tier === 'Plus';
            const isFree = plan.isFree;
            const isSelected = activePlanIndex === idx;

            return (
              <div
                key={plan.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                onClick={() => setActivePlanIndex(idx)}
                className={`snap-center flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[calc(25%-18px)] rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 cursor-pointer ${
                  isPro
                    ? 'bg-white dark:bg-[#0f111a] border-2 border-brand-500 shadow-2xl shadow-brand-500/20'
                    : isUltra
                    ? 'bg-white dark:bg-[#0d0f17] border-2 border-purple-500/80 shadow-xl shadow-purple-500/10'
                    : isPlus
                    ? 'bg-white dark:bg-[#0c0d14] border border-blue-500/30 shadow-md'
                    : 'bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 shadow-sm'
                } ${isSelected ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-[#080c14]' : ''}`}
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
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/5">
                  {isFree ? (
                    <Link
                      to="/courses/html"
                      className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Bepul Boshlash</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenPaymentModal && onOpenPaymentModal(plan.id)}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                        isPro
                          ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-900'
                          : isUltra
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{plan.ctaText || 'Obuna Bo\'lish'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
};
