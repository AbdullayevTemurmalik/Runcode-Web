import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Layers, 
  BookOpen, 
  List, 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  Lock, 
  Sparkles, 
  ChevronDown, 
  Loader2, 
  ExternalLink,
  Award,
  Terminal,
  Circle,
  Globe
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { renderTechLogo } from '../components/TechLogos';
import { splitLessonsInto4Modules, checkModuleAccess } from '../data/courseQuizzes';

// 8 ta asosiy texnologiyalar uchun moslashtirilgan boy ma'lumotlar
const COURSE_STATIC_INFO = {
  html: {
    title: 'HTML Dasturlash Asoslari',
    shortName: 'HTML',
    category: 'Foundation',
    level: 'Boshlang\'ich',
    duration: '8 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: false,
    description: 'HTML to\'liq kurs o\'zbek tilida. Web sahifalarning asosi, semantik strukturasi, formlar, multimedia elementlari va amaliy loyihalar barchasi bitta kursda va mutlaqo bepul. O\'zingizning birinchi web sahifangizni yarating va uni internetga joylashni o\'rganing.',
    techTags: ['HTML5', 'Semantik Teglar', 'Formlar & Input', 'Multimedia', 'SEO Asoslari', 'Web Standartlar', 'Portfolio Loyiha'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. HTML Kirish va Asoslar',
        lessons: [
          '01-Dars: Kirish — Kompyuter, Editor, Browser',
          '02-Dars: HTMLga Kirish va Asosiy Tuzilma',
          '03-Dars: Tag lar va Attribute lar',
          '04-Dars: HTMLdagi Strukturaviy Elementlar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Amaliy Konstruksiyalar',
        lessons: [
          '05-Dars: Media Elementlari va Multimedia Content',
          '06-Dars: Link lar va Navigation',
          '07-Dars: Ro\'yxatlar — <ol>, <ul>, <dl>',
          '08-Dars: Jadvallar (Tables)'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Loyiha va Komponentlar',
        lessons: [
          '09-Dars: HTML Forms va Input Elementlar',
          '10-Dars: HTML Best Practices va SEO'
        ]
      }
    ]
  },
  css: {
    title: 'CSS va Zamonaviy Dizayn',
    shortName: 'CSS',
    category: 'Frontend',
    level: 'O\'rta daraja',
    duration: '14 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'CSS3 va zamonaviy web dizayn sirlari. Flexbox, CSS Grid, animatsiyalar, media so\'rovlar (responsiv dizayn) hamda BEM metodologiyasini professional darajada o\'rganing. Har qanday qurilma (smartfon, planshet, noutbuk) uchun moslashuvchan interfeyslar yarating.',
    techTags: ['CSS3', 'Flexbox', 'CSS Grid', 'Animatsiyalar', 'Media Queries', 'Responsiv Dizayn', 'BEM', 'UI Dizayn'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. CSS Asoslari va Selektorlar',
        lessons: [
          '01-Dars: CSSga Kirish va Sintaksis',
          '02-Dars: Ranglar, Shriftlar va Box Model',
          '03-Dars: Display xususiyatlari',
          '04-Dars: Position va Z-Index'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Flexbox Joylashuvi',
        lessons: [
          '05-Dars: Flex Container va Elementlar',
          '06-Dars: Flex Direction, Justify va Align',
          '07-Dars: Flex Wrap va Amaliy Menyu Loyihasi'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. CSS Grid va Layout',
        lessons: [
          '08-Dars: CSS Grid Asoslari',
          '09-Dars: Grid Template Columns va Rows',
          '10-Dars: Murakkab Dashboard Qolipi'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Responsivlik va Animatsiyalar',
        lessons: [
          '11-Dars: Media Queries va Mobile-First',
          '12-Dars: Transition va Keyframes Animatsiyalari',
          '13-Dars: BEM Metodologiyasi va Portfolio Loyihasi'
        ]
      }
    ]
  },
  javascript: {
    title: 'JavaScript To\'liq Kurs',
    shortName: 'JavaScript',
    category: 'Frontend',
    level: 'Murakkab',
    duration: '24 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'JavaScript dasturlash tilini noldan professional darajagacha o\'rganing. O\'zgaruvchilar, funksiyalar, DOM manipulyatsiya, hodisalar (Events), asinxron dasturlash (Promises, Async/Await), OOP hamda Event Loop mexanizmi amaliy loyihalar bilan to\'liq yoritilgan.',
    techTags: ['JavaScript ES6+', 'DOM', 'Events', 'Asinxron JS', 'Promises', 'Async/Await', 'OOP', 'Event Loop', 'Fetch API'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. JS Asoslari va Tiplar',
        lessons: [
          '01-Dars: JSga Kirish va O\'zgaruvchilar',
          '02-Dars: Ma\'lumot turlari va Operatorlar',
          '03-Dars: Shart operatorlari va Tsikllar',
          '04-Dars: Funksiyalar va Arrow Functions'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. DOM va Hodisalar',
        lessons: [
          '05-Dars: DOM Selektorlari',
          '06-Dars: Elementlar yaratish va Hodisalarni Tinglash',
          '07-Dars: Forma bilan ishlash va Validatsiya',
          '08-Dars: Interaktiv Todo-List Loyihasi'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Asinxron Dasturlash',
        lessons: [
          '09-Dars: Asinxronlik va SetTimeout',
          '10-Dars: Promise lar bilan ishlash',
          '11-Dars: Async / Await va Fetch API',
          '12-Dars: Ob-havo Ilovasi (Real API Loyihasi)'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Ilg\'or Mavzular',
        lessons: [
          '13-Dars: OOP va Sinflar (Classes)',
          '14-Dars: Event Loop va Xotirani Boshqarish',
          '15-Dars: Yakuniy Amaliy Loyiha'
        ]
      }
    ]
  },
  react: {
    title: 'React.js Ekotizimi',
    shortName: 'React',
    category: 'Frontend',
    level: 'Murakkab',
    duration: '20 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'Eng ommabop frontend kutubxonasi — React.js ni chuqur o\'rganing. Virtual DOM, JSX sintaksisi, barcha asosiy va custom Hooklar (useState, useEffect, useMemo, useCallback), React Router, Context API va server bilan integratsiya orqali real loyihalar yarating.',
    techTags: ['React 18', 'JSX', 'Hooks', 'Custom Hooks', 'React Router', 'Context API', 'Axios', 'State Management'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. React Asoslari va JSX',
        lessons: [
          '01-Dars: React Nima va Virtual DOM',
          '02-Dars: Vite orqali Loyiha O\'rnatish',
          '03-Dars: JSX Sintaksisi va Komponentlar',
          '04-Dars: Props va Ma\'lumot uzatish'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Asosiy Hooklar',
        lessons: [
          '05-Dars: useState Hooki va Holat',
          '06-Dars: useEffect va Lifecycle',
          '07-Dars: Ro\'yxatlar va Kalitlar (Keys)',
          '08-Dars: Formalar va Boshqariladigan Komponentlar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Marshrutlash va Global Holat',
        lessons: [
          '09-Dars: React Router DOM',
          '10-Dars: useContext va Context API',
          '11-Dars: Custom Hooklar Yaratish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Real Amaliy Loyiha',
        lessons: [
          '12-Dars: Axios bilan Backendga Ulanish',
          '13-Dars: To\'liq E-Commerce SPA Ilovasi'
        ]
      }
    ]
  },
  node: {
    title: 'Node.js & Express.js Backend',
    shortName: 'Node.js',
    category: 'Backend',
    level: 'O\'rta daraja',
    duration: '24 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Server dasturlash asoslari, Node.js asinxron arxitekturasi va Express.js freymvorki. RESTful API arxitekturasi, Middleware tizimi, JWT orqali foydalanuvchilarni autentifikatsiya qilish, PostgreSQL ma\'lumotlar bazasi va server xavfsizligi.',
    techTags: ['Node.js', 'Express.js', 'REST API', 'PostgreSQL', 'JWT', 'Middleware', 'Bcrypt', 'Server Arxitekturasi'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Node.js Asoslari va Muhit',
        lessons: [
          '01-Dars: Node.js Runtime va Event Loop',
          '02-Dars: NPM va Paketlar bilan ishlash',
          '03-Dars: Fayllar Tizimi (FS moduli)',
          '04-Dars: HTTP Server Asoslari'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Express.js va RESTful API',
        lessons: [
          '05-Dars: Express Routing va Controllerlar',
          '06-Dars: Custom Middlewarelar',
          '07-Dars: RESTful API Standartlari',
          '08-Dars: Fayl yuklash (Multer)'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. PostgreSQL va Ma\'lumotlar Bazasi',
        lessons: [
          '09-Dars: PostgreSQLga Ulanish (pg-pool)',
          '10-Dars: CRUD Operatsiyalari va Relyatsiyalar',
          '11-Dars: SQL Injectiondan Himoyalanish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. Xavfsizlik, JWT va Deploy',
        lessons: [
          '12-Dars: Parollarni Shifrlash (Bcrypt)',
          '13-Dars: JWT Token va Himoyalangan Marshrutlar',
          '14-Dars: Serverni Productionga Chiqarish'
        ]
      }
    ]
  },
  next: {
    title: 'Next.js 15 Server Components',
    shortName: 'Next.js',
    category: 'Full-Stack',
    level: 'Murakkab',
    duration: '20 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Zamonaviy React freymvorki — Next.js 15. Yangi App Router arxitekturasi, Server Components va Server Actions, SSR (Server-Side Rendering), SSG, SEO optimallashtirish va to\'liq Full-Stack ilovalarni yaratish.',
    techTags: ['Next.js 15', 'App Router', 'Server Components', 'Server Actions', 'SSR & SSG', 'SEO', 'Full-Stack'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Next.js 15 va App Router',
        lessons: [
          '01-Dars: Next.js Nima va Nega Kerak?',
          '02-Dars: App Router Papkalar Strukturasi',
          '03-Dars: Layouts va Pages Konseptsiyasi',
          '04-Dars: Dynamic Routes va Parametrlar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Server vs Client Komponentlar',
        lessons: [
          '05-Dars: React Server Components (RSC)',
          '06-Dars: "use client" Qachon Ishlatiladi?',
          '07-Dars: Ma\'lumotlarni Kesh Lash (Caching)',
          '08-Dars: Server Actions orqali Formani Jo\'natish'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. SEO va Optimizatsiya',
        lessons: [
          '09-Dars: Metadata va Open Graph (SEO)',
          '10-Dars: Rasm va Shriftlar Optimizatsiyasi',
          '11-Dars: Full-Stack Amaliy Loyiha'
        ]
      }
    ]
  },
  vue: {
    title: 'Vue.js 3 & Pinia Ekotizimi',
    shortName: 'Vue.js',
    category: 'Frontend',
    level: 'O\'rta daraja',
    duration: '18 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Vue.js 3 ning zamonaviy imkoniyatlari: Composition API, reaktivlik mexanizmi, Single File Components, Pinia orqali global holatni boshqarish, Vue Router va yuqori tezlikdagi SPA ilovalar yaratish.',
    techTags: ['Vue 3', 'Composition API', 'Pinia', 'Vue Router', 'Vite', 'Reaktivlik', 'SPA Ilovalar'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Vue 3 Asoslari',
        lessons: [
          '01-Dars: Vue 3 Ekosistemasi',
          '02-Dars: Template Sintaksisi va Direktivalar',
          '03-Dars: Reaktivlik — ref() va reactive()',
          '04-Dars: Computed va Watchers'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Komponentlar va Props',
        lessons: [
          '05-Dars: Single File Components (SFC)',
          '06-Dars: Props va Emits Mexanizmi',
          '07-Dars: Slots va Dinamik Komponentlar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Pinia va Vue Router',
        lessons: [
          '08-Dars: Vue Router bilan Sahifalash',
          '09-Dars: Pinia Store orqali State Management',
          '10-Dars: Yakuniy Amaliy Dashboard Loyihasi'
        ]
      }
    ]
  },
  typescript: {
    title: 'TypeScript Professional',
    shortName: 'TypeScript',
    category: 'Frontend / Backend',
    level: 'O\'rta daraja',
    duration: '16 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'JavaScript loyihalarida qat\'iy tiplashtirish va toza arxitektura. Primitive va murakkab tiplar, interfeyslar, Generics, Utility Types, React va Node.js bilan birgalikda TypeScriptdan samarali foydalanish.',
    techTags: ['TypeScript', 'Types & Interfaces', 'Generics', 'Utility Types', 'React + TypeScript', 'Xavfsiz Kod'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. TypeScript Asoslari',
        lessons: [
          '01-Dars: Nega TypeScript Kerak?',
          '02-Dars: Primitive Tiplar va Tip Aniqlash',
          '03-Dars: Funksiyalar va Return Tiplar',
          '04-Dars: Union va Intersection Tiplar'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Interfeyslar va Obyektlar',
        lessons: [
          '05-Dars: Interfaces vs Type Aliases',
          '06-Dars: Obyektlarni Tiplash va Readonly',
          '07-Dars: Enums va Literal Tiplar'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Generics va Frameworklar',
        lessons: [
          '08-Dars: Generics Nima va Qanday Ishlaydi?',
          '09-Dars: Utility Types (Partial, Pick, Omit)',
          '10-Dars: React Komponentlarida TypeScript'
        ]
      }
    ]
  },
  ai: {
    title: 'AI Bilan Mukammal Ishlash',
    shortName: 'Sun\'iy Intellekt',
    category: 'Sun\'iy Intellekt',
    level: 'Zamonaviy',
    duration: '18 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: true,
    is_premium: true,
    description: 'Sun\'iy intellekt vositalari (ChatGPT, Claude, GitHub Copilot, Cursor AI, Midjourney) yordamida dasturlash va muhandislik unumdorligini 10 barobarga oshirish. Prompt engineering, AI agentlar, avtomatlashtirish va kodni tez va sifatli yaratish sirlari.',
    techTags: ['ChatGPT', 'Claude AI', 'GitHub Copilot', 'Cursor AI', 'Prompt Engineering', 'Midjourney', 'AI Agents', 'Avtomatlashtirish'],
    fallbackModules: [
      {
        id: 'mod-1',
        title: '1-Modul. Zamonaviy AI Vositalari va Kirish',
        lessons: [
          '01-Dars: Dasturlashda AI Inqilobi va Ekosistema',
          '02-Dars: ChatGPT va Claude: Imkoniyatlar va Farqlar',
          '03-Dars: Prompt Engineering Asoslari va Qoidalari',
          '04-Dars: Kontekstni To\'g\'ri Berish va Prompt Strukturasi'
        ]
      },
      {
        id: 'mod-2',
        title: '2-Modul. Kodlashda AI: GitHub Copilot & Cursor AI',
        lessons: [
          '05-Dars: Cursor IDE — AI Bilan Kod Yozish Muhiti',
          '06-Dars: GitHub Copilot: Avtomatik Kod Yozish va Chat',
          '07-Dars: Murakkab Funksiyalarni Generatsiya Qilish',
          '08-Dars: Kod Refaktoringi va Buglarni Qidirish'
        ]
      },
      {
        id: 'mod-3',
        title: '3-Modul. Testlash, Hujjatlashtirish va Vizual AI',
        lessons: [
          '09-Dars: Unit Testlar va Integratsion Testlarni Yozdirish',
          '10-Dars: Loyihaga README va Dokumentatsiyalarni Tayyorlash',
          '11-Dars: Midjourney va DALL-E orqali UI/UX Assetlar Yaratish'
        ]
      },
      {
        id: 'mod-4',
        title: '4-Modul. AI Agentlar va Real Loyiha',
        lessons: [
          '12-Dars: Autonomous AI Agentlar va API Integratsiyasi',
          '13-Dars: AI Yordamida Noldan Full-Stack Ilova Qurish'
        ]
      }
    ]
  }
};

export const CourseDetailPage = ({ onOpenPaymentModal }) => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user, hasSubscription } = useAuth();

  const [dbCourse, setDbCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Normalize slug (masalan 'nodejs' -> 'node', 'nextjs' -> 'next', 'vuejs' -> 'vue')
  const normalizedSlug = useMemo(() => {
    const s = (courseSlug || '').toLowerCase();
    if (s === 'nodejs') return 'node';
    if (s === 'nextjs') return 'next';
    if (s === 'vuejs') return 'vue';
    return s;
  }, [courseSlug]);

  const staticInfo = COURSE_STATIC_INFO[normalizedSlug] || {
    title: 'Dasturlash Kursi',
    shortName: 'Dasturlash',
    category: 'Frontend',
    level: 'O\'rta daraja',
    duration: '12 Soat',
    studentsCount: '100+ o\'quvchi',
    isUpcoming: false,
    is_premium: true,
    description: 'Zamonaviy dasturlash texnologiyalari va amaliy ko\'nikmalar.',
    techTags: ['Dasturlash', 'Kod yozish', 'Amaliyot'],
    fallbackModules: []
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/courses/${courseSlug}`);
        if (data && data.success && data.course) {
          setDbCourse(data.course);
        }
      } catch (err) {
        // Agar bazada yo'q bo'lsa (masalan Tez Kunda kursi), statik ma'lumotdan foydalanamiz
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseSlug]);

  // Bo'limlar ro'yxatini shakllantirish (Real DB darslari yoki Static Fallback)
  const rawModules = useMemo(() => {
    if (dbCourse?.lessons && dbCourse.lessons.length > 0) {
      const list = splitLessonsInto4Modules(dbCourse.lessons, courseSlug);
      return list.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          number: dbCourse.lessons.findIndex(item => item.id === l.id) + 1,
          is_completed: l.is_completed
        }))
      }));
    }

    // Static fallback bo'lsa
    return staticInfo.fallbackModules.map((m, idx) => ({
      id: m.id || `mod-${idx + 1}`,
      index: idx + 1,
      title: m.title,
      description: '',
      isCompleted: false,
      completedCount: 0,
      lessons: m.lessons.map((lessonTitle, lIdx) => ({
        id: `mock-${idx + 1}-${lIdx + 1}`,
        title: lessonTitle,
        number: lIdx + 1,
        is_completed: false
      }))
    }));
  }, [dbCourse, staticInfo, courseSlug]);

  const modules = useMemo(() => {
    return checkModuleAccess(rawModules, courseSlug, user?.id, user?.role);
  }, [rawModules, courseSlug, user?.id, user?.role]);

  // Dastlabki 1-modulni avtomatik ochib qo'yish (boshqa modullar yopiq)
  useEffect(() => {
    if (modules.length > 0) {
      setExpandedModules({ [modules[0].id]: true });
    }
  }, [modules]);

  const toggleModule = (mod) => {
    if (!mod.isUnlocked && user?.role !== 'admin') {
      setToastMessage(`${mod.index}-Modul qulflangan! Avval ${mod.index - 1}-modul darslarini to'liq tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    setExpandedModules((prev) => ({
      ...prev,
      [mod.id]: !prev[mod.id]
    }));
  };

  const isPremium = dbCourse ? dbCourse.is_premium : staticInfo.is_premium;
  const canAccess = !isPremium || hasSubscription;
  const isUpcoming = staticInfo.isUpcoming;
  const totalLessonsCount = dbCourse?.lessons?.length || modules.reduce((sum, m) => sum + m.lessons.length, 0);

  // Kursni boshlash tugmasi bosilganda
  const handleStartCourse = () => {
    if (isUpcoming) {
      setToastMessage('Ushbu kurs hozirda yozilmoqda va tez kunda platformada taqdim etiladi!');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (!user) {
      navigate('/login', { 
        state: { 
          message: 'Kurs darslarini boshlash uchun avval tizimga kiring.',
          from: `/courses/${courseSlug}/learn`
        } 
      });
      return;
    }

    if (isPremium && !hasSubscription) {
      if (onOpenPaymentModal) {
        onOpenPaymentModal('1_month');
      } else {
        navigate('/tariffs');
      }
      return;
    }

    // Kurs darslik oynasiga yo'naltirish
    navigate(`/courses/${courseSlug}/learn`);
  };

  // Muayyan darsga bosilganda
  const handleLessonClick = (lesson, mod) => {
    if (isUpcoming) {
      handleStartCourse();
      return;
    }

    if (mod && !mod.isUnlocked && user?.role !== 'admin') {
      setToastMessage(`${mod.index}-Modul qulflangan! Avval ${mod.index - 1}-modul darslarini to'liq tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (!user) {
      navigate('/login', { 
        state: { 
          message: 'Kurs darslarini boshlash uchun avval tizimga kiring.',
          from: `/courses/${courseSlug}/learn`
        } 
      });
      return;
    }

    if (isPremium && !hasSubscription) {
      if (onOpenPaymentModal) onOpenPaymentModal('1_month');
      return;
    }

    if (lesson.id && !String(lesson.id).startsWith('mock-')) {
      navigate(`/courses/${courseSlug}/lesson/${lesson.id}`);
    } else {
      navigate(`/courses/${courseSlug}/learn`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 transition-colors py-8 sm:py-12">
      <div className="container-custom space-y-8 animate-in fade-in">
        
        {/* Toast Bildirishnoma */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Barcha kurslarga qaytish tugmasi */}
        <div>
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Barcha kurslarga qaytish</span>
          </Link>
        </div>

        {/* 2. Kurs Sarlavhasi, Nishonlar va Ko'rsatkichlar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-200 dark:border-white/10">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              {dbCourse?.title || staticInfo.title}
            </h1>

            {/* Nishonlar qatori */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                {staticInfo.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                {staticInfo.level}
              </span>
              {isUpcoming ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>OFFLINE</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE</span>
                </span>
              )}
            </div>
          </div>

          {/* O'ng tarafdagi 4 ta ko'rsatkich (Davomiylik, Formati: ONLINE/OFFLINE, O'quvchilar, Modullar) */}
          <div className="flex items-center gap-5 sm:gap-7 pt-4 lg:pt-0">
            <div>
              <p className="text-[11px] text-gray-400 flex items-center space-x-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Davomiylik</span>
              </p>
              <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                {staticInfo.duration}
              </p>
            </div>

            <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />

            <div>
              <p className="text-[11px] text-gray-400 flex items-center space-x-1 mb-1">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Formati</span>
              </p>
              <p className={`text-lg sm:text-xl font-black ${isUpcoming ? 'text-amber-500' : 'text-emerald-500'}`}>
                {isUpcoming ? 'OFFLINE' : 'ONLINE'}
              </p>
            </div>

            <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />

            <div>
              <p className="text-[11px] text-gray-400 flex items-center space-x-1 mb-1">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>O'quvchilar</span>
              </p>
              <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                {staticInfo.studentsCount}
              </p>
            </div>

            <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />

            <div>
              <p className="text-[11px] text-gray-400 flex items-center space-x-1 mb-1">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>Modullar</span>
              </p>
              <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                {modules.length}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Asosiy 2 Ustunli Tarkib */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chap Tomon: Kurs haqida & Kurs dasturi (8 ta ustun) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Kurs haqida Blok */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 shadow-sm space-y-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Kurs haqida
                </h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {dbCourse?.description || staticInfo.description}
              </p>

              {/* O'rganiladigan texnologiyalar */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  O'rganiladigan texnologiyalar
                </p>
                <div className="flex flex-wrap gap-2">
                  {staticInfo.techTags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Kurs dasturi (Modullar va Darslar) Blok */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4 text-brand-500" />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Kurs dasturi
                </h2>
              </div>

              {/* Modullar Accordion Ro'yxati */}
              <div className="space-y-3">
                {modules.map((mod) => {
                  const isExpanded = !!expandedModules[mod.id];
                  const isLocked = !mod.isUnlocked && user?.role !== 'admin';

                  return (
                    <div 
                      key={mod.id}
                      className={`rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 ${
                        isLocked
                          ? 'border-gray-200/50 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.01]'
                          : 'border-gray-200 dark:border-white/5 bg-white dark:bg-[#0c0d12]/90'
                      }`}
                    >
                      {/* Modul Sarlavhasi (Toggle) */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod)}
                        className={`w-full p-4 flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isExpanded ? 'bg-gray-50/80 dark:bg-white/[0.03]' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {isLocked ? (
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                              <Lock className="w-4 h-4" />
                            </div>
                          ) : mod.hasPassedQuiz ? (
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-500 block">
                              {mod.index}-Modul {isLocked && '(Qulflangan)'}
                            </span>
                            <span className={`text-xs sm:text-sm font-bold ${
                              isLocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                            }`}>
                              {mod.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-semibold text-gray-400">
                            {mod.lessons.length} ta dars
                          </span>
                          <div className={`p-1 rounded-lg transition-transform duration-300 transform ${isExpanded ? 'rotate-180 text-brand-500' : 'rotate-0 text-gray-400'}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Modul Darslari (Silliq Animatsiya) */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-3 space-y-1.5 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/20">
                            {isLocked ? (
                              <div className="p-3 text-center space-y-1">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                  {mod.index}-Modul qulflangan
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {mod.index - 1}-modul darslarini tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.
                                </p>
                              </div>
                            ) : (
                              mod.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson, mod)}
                                  className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between bg-white dark:bg-[#0c0d12] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-all cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/5"
                                >
                                  <div className="flex items-center space-x-2.5 truncate mr-2">
                                    <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold">
                                      {lesson.number}
                                    </span>
                                    <span className="truncate">{lesson.title}</span>
                                  </div>

                                  {isUpcoming ? (
                                    <span className="text-[10px] text-amber-500 font-bold">Tez kunda</span>
                                  ) : isLocked ? (
                                    <Lock className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0" />
                                  ) : !isPremium || canAccess ? (
                                    <Play className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                                  ) : (
                                    <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* O'ng Tomon: Qalqib Turuvchi Tarif & Kirish Kartochkasi (4 ta ustun) */}
          <div className="lg:col-span-4 sticky top-24">
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
          </div>

        </div>

      </div>
    </div>
  );
};
