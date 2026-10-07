import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Layers, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Sparkles, 
  Clock, 
  Users, 
  BookOpen, 
  Loader2, 
  Filter, 
  X, 
  Info,
  Globe 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { renderTechLogo } from '../components/TechLogos';

export const CoursesPage = ({ onOpenPaymentModal }) => {
  const { user, hasSubscription } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tanlangan tab (Select)
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/courses');
        if (data && data.success) {
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.error('Kurslarni yuklashda xatolik:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Platformadagi 8 ta asosiy kurs (4 ta mavjud + 4 ta tez kunda)
  const allEightCourses = useMemo(() => {
    // 1. Bazadagi 4 ta real kurs
    const realCourseList = courses.map((c) => {
      let levelLabel = "O'rta daraja";
      let lessonsCount = '12 ta dars';
      if (c.slug === 'html') {
        levelLabel = "Boshlang'ich";
        lessonsCount = '11 ta dars';
      } else if (c.slug === 'css') {
        levelLabel = "O'rta daraja";
        lessonsCount = '19 ta dars';
      } else if (c.slug === 'javascript') {
        levelLabel = "Murakkab";
        lessonsCount = '28 ta dars';
      } else if (c.slug === 'react') {
        levelLabel = "Murakkab";
        lessonsCount = '15 ta dars';
      }

      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel,
        lessonsCount: c.lesson_count ? `${c.lesson_count} ta dars` : lessonsCount,
        studentsCount: '100+ o\'quvchi',
        is_premium: c.is_premium,
        isUpcoming: false
      };
    });

    // Agar bazadan hali kelmagan bo'lsa default 4 ta real kurs
    const baseCourses = realCourseList.length > 0 ? realCourseList : [
      {
        id: 1,
        slug: 'html',
        title: 'HTML Dasturlash Asoslari',
        description: 'Web sahifalarning asosi va semantik strukturasi. Bepul o\'rganing va amaliy kod yozish ko\'nikmalariga ega bo\'ling!',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'Boshlang\'ich',
        lessonsCount: '11 ta dars',
        studentsCount: '100+ o\'quvchi',
        is_premium: false,
        isUpcoming: false
      },
      {
        id: 2,
        slug: 'css',
        title: 'CSS va Zamonaviy Dizayn',
        description: 'Flexbox, Grid, Animatsiyalar, Media Queries (Responsiv dizayn) va BEM metodologiyasini chuqur o\'rganish.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'O\'rta daraja',
        lessonsCount: '19 ta dars',
        studentsCount: '100+ o\'quvchi',
        is_premium: true,
        isUpcoming: false
      },
      {
        id: 3,
        slug: 'javascript',
        title: 'JavaScript To\'liq Kurs',
        description: 'Boshlang\'ich tushunchalardan tortib DOM, Events, Asinxron dasturlash (Promises, Async/Await), OOP va Event Loopgacha mukammal bilim.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'Murakkab',
        lessonsCount: '28 ta dars',
        studentsCount: '100+ o\'quvchi',
        is_premium: true,
        isUpcoming: false
      },
      {
        id: 4,
        slug: 'react',
        title: 'React.js Ekotizimi',
        description: 'Komponentlar, JSX, Hooks (useState, useEffect, useContext), React Router, Axios, CRUD va xotirani optimallashtirish.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'Murakkab',
        lessonsCount: '15 ta dars',
        studentsCount: '100+ o\'quvchi',
        is_premium: true,
        isUpcoming: false
      }
    ];

    // 2. Platformadagi 4 ta rasmiy Tez Kunda kursi (Jami aynan 8 ta kurs bo'ladi)
    const upcomingList = [
      {
        id: 'upcoming-node',
        slug: 'node',
        title: 'Node.js & Express.js Backend',
        description: 'RESTful API arxitekturasi, Middleware, JWT autentifikatsiya, PostgreSQL bazasi bilan ishlash va server dasturlash.',
        category: 'backend',
        categoryLabel: 'Backend',
        levelLabel: 'O\'rta daraja',
        lessonsCount: '24 ta dars',
        studentsCount: 'Rejalashtirilgan',
        is_premium: true,
        isUpcoming: true
      },
      {
        id: 'upcoming-next',
        slug: 'next',
        title: 'Next.js 15 Server Components',
        description: 'App Router, Server Actions, SSR, SSG, SEO optimallashtirish va to\'liq Full-Stack ilovalar.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'Murakkab',
        lessonsCount: '20 ta dars',
        studentsCount: 'Rejalashtirilgan',
        is_premium: true,
        isUpcoming: true
      },
      {
        id: 'upcoming-vue',
        slug: 'vue',
        title: 'Vue.js 3 & Pinia Ekotizimi',
        description: 'Composition API, Reactivity tizimi, Single File Components, Vite va zamonaviy SPA ilovalari.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'O\'rta daraja',
        lessonsCount: '18 ta dars',
        studentsCount: 'Rejalashtirilgan',
        is_premium: true,
        isUpcoming: true
      },
      {
        id: 'upcoming-ts',
        slug: 'typescript',
        title: 'TypeScript Professional',
        description: 'Qat\'iy tiplashtirish, Generics, Utility Types, interfeyslar va xatosiz toza kod yozish madaniyati.',
        category: 'frontend',
        categoryLabel: 'Frontend',
        levelLabel: 'O\'rta daraja',
        lessonsCount: '16 ta dars',
        studentsCount: 'Rejalashtirilgan',
        is_premium: true,
        isUpcoming: true
      },
      {
        id: 'upcoming-ai',
        slug: 'ai',
        title: 'AI Bilan Mukammal Ishlash',
        description: 'Sun\'iy intellekt (ChatGPT, Claude, GitHub Copilot, Cursor AI) yordamida dasturlash va muammolarni yechish tezligini 10 barobarga oshirish.',
        category: 'ai',
        categoryLabel: 'Sun\'iy Intellekt',
        levelLabel: 'Zamonaviy',
        lessonsCount: '18 ta dars',
        studentsCount: 'Rejalashtirilgan',
        is_premium: true,
        isUpcoming: true
      }
    ];

    return [...baseCourses, ...upcomingList];
  }, [courses]);

  // Qidiruv va tanlangan Select tab bo'yicha to'g'ri filtrlash
  const filteredCourses = useMemo(() => {
    return allEightCourses.filter((course) => {
      // Qidiruv
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches = 
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.slug.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Select / Tab filtri
      if (activeTab === 'all') return true;
      if (activeTab === 'frontend') return course.category === 'frontend';
      if (activeTab === 'backend') return course.category === 'backend';
      if (activeTab === 'ai') return course.category === 'ai' || course.slug === 'ai';
      if (activeTab === 'upcoming') return course.isUpcoming === true;
      if (activeTab === 'free') return !course.is_premium;
      if (activeTab === 'premium') return course.is_premium && !course.isUpcoming;

      return true;
    });
  }, [allEightCourses, searchTerm, activeTab]);

  const handleCourseClick = (e, course) => {
    if (e) e.preventDefault();
    navigate(`/courses/${course.slug}`);
  };

  // Aniq va qulay Select Tablari
  const filterTabs = [
    { id: 'all', label: 'Barcha Kurslar' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'ai', label: "Sun'iy Intellekt (AI)" },
    { id: 'upcoming', label: 'Tez Kunda' },
    { id: 'free', label: '100% Bepul' },
    { id: 'premium', label: 'Premium Obuna' }
  ];

  return (
    <div className="py-12 sm:py-20 space-y-12">
      
      {/* 1. Header Section */}
      <div className="container-custom max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide">
          <Layers className="w-3.5 h-3.5 text-brand-500" />
          <span>Professional Ta'lim Katalogi</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Noldan Karyeragacha <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-400">Dasturlash Kurslari</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Amaliy mashg'ulotlar, interaktiv kod muharriri, mustaqil amaliy loyihalar hamda doimiy yordam ko'rsatuvchi mutaxassislar hamjamiyati.
        </p>

        {/* Qidiruv Qatori */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qaysi texnologiyani o'rganmoqchisiz? (masalan: React, JavaScript, HTML, Node.js)..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chiroyli Select Tablari (Aynan skrinshotdagidek toza va tartibli) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-brand-500/40 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Toast Xabarnomasi (Tez kunda bosilganda) */}
      {toastMessage && (
        <div className="container-custom max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium flex items-start justify-between space-x-3 shadow-md animate-in fade-in">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 8 ta Kursning Mukammal 3-Ustunli To'ri (Grid) */}
      <div className="container-custom">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-xs text-gray-400 font-medium">Kurslar yuklanmoqda...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Tanlangan parametr bo'yicha kurs topilmadi
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setActiveTab('all'); }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Barcha Kurslarni Ko'rsatish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const canAccess = !course.is_premium || hasSubscription;
              const isUpcoming = course.isUpcoming;

              return (
                <div
                  key={course.id}
                  onClick={(e) => handleCourseClick(e, course)}
                  className="cursor-pointer group relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 hover:border-brand-500/60 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div>
                    {/* Yuqori Nishonlar */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                        {renderTechLogo(course.slug, 'w-8 h-8')}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                          {course.levelLabel}
                        </span>

                        {isUpcoming ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1.5" />
                            Tez Kunda
                          </span>
                        ) : course.is_premium ? (
                          canAccess ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center shadow-sm">
                              <Unlock className="w-3 h-3 mr-1" /> Ochiq (Aktiv Obuna)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center shadow-sm">
                              <Lock className="w-3 h-3 mr-1" /> Obuna Kerak
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center shadow-sm">
                            <Sparkles className="w-3 h-3 mr-1" /> 100% Bepul
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Yo'nalish va Ta'lim Formati Teglari */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isUpcoming 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                      }`}>
                        {course.categoryLabel}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                        isUpcoming
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                        <span>{isUpcoming ? 'OFFLINE' : 'ONLINE'}</span>
                      </span>
                    </div>

                    {/* Sarlavha & Tavsif */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors duration-300 mt-3">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3 min-h-[36px]">
                      {course.description}
                    </p>
                  </div>

                  {/* Pastki Qism: Darslar Soni, O'quvchilar va Yashil Harakat Tugmasi */}
                  <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-brand-500" />
                        <span>{course.lessonsCount}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        <span>{course.studentsCount}</span>
                      </span>
                    </div>

                    <div className="flex items-center">
                      {isUpcoming ? (
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center space-x-1.5 transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tez Kunda</span>
                        </span>
                      ) : canAccess ? (
                        <span className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center transition-all duration-300 shadow-md shadow-brand-500/20 transform group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:bg-brand-500 group-hover:shadow-lg group-hover:shadow-brand-500/40 hover:scale-125 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-500/50">
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </span>
                      ) : (
                        <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center space-x-1.5 transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:bg-amber-500 group-hover:text-white">
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
        )}
      </div>

    </div>
  );
};
