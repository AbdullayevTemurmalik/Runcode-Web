import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HomeHero } from '../components/home/HomeHero';
import { HomeTechStack } from '../components/home/HomeTechStack';
import { HomeCoursesSection } from '../components/home/HomeCoursesSection';
import { HomePricingSection } from '../components/home/HomePricingSection';

const DEFAULT_COURSES = [
  {
    id: 1,
    title: "HTML Dasturlash Asoslari",
    slug: "html",
    description: "Web sahifalarning asosi va semantik strukturasi. Bepul o'rganing va amaliy kod yozish ko'nikmalariga ega bo'ling!",
    is_premium: false,
    order_index: 1,
    icon_name: "FileCode",
    lesson_count: 11
  },
  {
    id: 2,
    title: "CSS va Zamonaviy Dizayn",
    slug: "css",
    description: "Flexbox, Grid, Animatsiyalar, Media Queries (Responsiv dizayn) va BEM metodologiyasini chuqur o'rganish.",
    is_premium: true,
    order_index: 2,
    icon_name: "Palette",
    lesson_count: 19
  },
  {
    id: 3,
    title: "JavaScript To'liq Kurs",
    slug: "javascript",
    description: "Boshlang'ich tushunchalardan tortib DOM, Events, Asinxron dasturlash (Promises, Async/Await), OOP va Event Loopgacha mukammal bilim.",
    is_premium: true,
    order_index: 3,
    icon_name: "Braces",
    lesson_count: 28
  },
  {
    id: 4,
    title: "React.js Ekotizimi",
    slug: "react",
    description: "Komponentlar, JSX, Hooks (useState, useEffect, useContext), React Router, Axios, CRUD va xotirani optimallashtirish.",
    is_premium: true,
    order_index: 4,
    icon_name: "Atom",
    lesson_count: 15
  }
];

export const HomePage = ({ onOpenPaymentModal }) => {
  const { isAuthenticated, hasSubscription } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Swiper / Karusel holati (Free, Plus, Pro, Ultra)
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [coursesResult, paymentsResult] = await Promise.allSettled([
          api.get('/courses'),
          api.get('/payments/config')
        ]);
        if (!isMounted) return;
        if (coursesResult.status === 'fulfilled' && coursesResult.value?.success && coursesResult.value?.courses?.length > 0) {
          setCourses(coursesResult.value.courses);
        }
        if (paymentsResult.status === 'fulfilled' && paymentsResult.value?.success && paymentsResult.value?.plans) {
          const list = Object.values(paymentsResult.value.plans).filter(p => !p.isFree && p.id !== 'free');
          if (list.length > 0) {
            setPricingPlans(list);
          }
        }
      } catch (err) {
        console.error('Bosh sahifa ma\'lumotlarini yuklashda xatolik:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
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

  // Default plans (Plus 7 kun, Pro 1 oy, Pro+ 2 oy, Ultra 3 oy)
  const defaultPlans = [
    {
      id: '7_days',
      tier: 'Plus',
      name: 'Plus (7 Kunlik)',
      duration: '7 kun to\'liq ochiq',
      price: '20 000 so\'m',
      desc: 'Test uchun sinang va platformaning barcha imkoniyatlaridan foydalaning',
      badge: 'Test uchun sinang',
      features: [
        'Barcha 4 ta kurs: HTML, CSS, JS, React',
        '73 ta interaktiv amaliy darslik',
        'Interaktiv kod muharriri va mashqlar',
        'Barcha mavzular bo\'yicha testlar',
        'Yopiq Telegram mentorlik guruhi'
      ],
      notIncluded: [],
      ctaText: 'Plus Obuna',
      isFree: false,
      recommended: false
    },
    {
      id: '1_month',
      tier: 'Pro',
      name: 'Pro (1 Oylik)',
      duration: '1 oy to\'liq ochiq',
      price: '50 000 so\'m',
      desc: 'Tez sur\'atda chuqur bilim oluvchilar uchun optimal reja',
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
      duration: '2 oy to\'liq ochiq',
      price: '90 000 so\'m',
      desc: 'Frontend dasturchi bo\'lish uchun eng optimal va tavsiya etilgan reja',
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
      tier: 'Ultra',
      name: 'Ultra (3 Oylik)',
      duration: '3 oy to\'liq ochiq',
      price: '120 000 so\'m',
      desc: 'Maksimal tejamkorlik va to\'liq professional tayyorgarlik',
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
      recommended: false,
      superSaver: true
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
      <HomeHero isAuthenticated={isAuthenticated} />
      <HomeTechStack techStack={techStack} />
      <HomeCoursesSection 
        courses={courses} 
        isAuthenticated={isAuthenticated} 
        hasSubscription={hasSubscription} 
        onCourseClick={handleCourseAction} 
      />
      <HomePricingSection 
        plansToDisplay={plansToDisplay}
        activePlanIndex={activePlanIndex}
        setActivePlanIndex={setActivePlanIndex}
        carouselRef={carouselRef}
        cardRefs={cardRefs}
        handlePrevPlan={handlePrevPlan}
        handleNextPlan={handleNextPlan}
        onOpenPaymentModal={onOpenPaymentModal}
      />
    </div>
  );
};
