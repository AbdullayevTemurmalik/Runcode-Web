import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Unlock,
  ArrowLeft, 
  ArrowRight, 
  Award, 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  Menu, 
  X, 
  ShieldAlert, 
  Loader2, 
  Sparkles,
  Code2,
  Terminal,
  Play
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { CodePlayground } from '../components/CodePlayground';
import { renderTechLogo } from '../components/TechLogos';
import { 
  splitLessonsInto4Modules, 
  checkModuleAccess, 
  getCourseQuizProgress 
} from '../data/courseQuizzes';
import { ModuleQuizModal } from '../components/ModuleQuizModal';
import { useSecurityShield } from '../hooks/useSecurityShield';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { SecurityCurtain } from '../components/SecurityCurtain';

export const LessonViewPage = ({ onOpenPaymentModal }) => {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, hasSubscription } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  // Faqat 1-modul boshida ochiq bo'ladi
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true });
  const [showExamReadyModal, setShowExamReadyModal] = useState(false);
  const [lockedToast, setLockedToast] = useState(null);
  const [quizModal, setQuizModal] = useState({ isOpen: false, moduleIndex: 1 });
  const [quizRefreshToken, setQuizRefreshToken] = useState(0);

  // Darslik ichida anti-copy, anti-screenshot va snipping tool himoyasi
  const { isPrtScnTriggered, isWindowBlurred, warningMessage } = useSecurityShield({
    enableAntiCopy: true,
    enableAntiScreenshot: true,
    enableBlurShield: true
  });

  // Kurs va darslar ro'yxatini olish (Flicker-free lesson switching)
  useEffect(() => {
    let isCancelled = false;

    const fetchCourseData = async () => {
      // Agar kurs allaqachon yuklangan bo'lsa va shu kurs bo'lsa, butun sahifani qayta loading qilmaymiz!
      if (!course || course.slug !== courseSlug) {
        setLoading(true);
        setError(null);
        try {
          const data = await api.get(`/courses/${courseSlug}`);
          if (!isCancelled && data.success && data.course) {
            setCourse(data.course);

            const lessons = data.course.lessons || [];
            if (lessons.length > 0) {
              let targetLesson = null;
              if (lessonId) {
                targetLesson = lessons.find(l => String(l.id) === String(lessonId));
              }
              if (!targetLesson) {
                targetLesson = lessons[0];
              }
              fetchLessonDetail(targetLesson.id);
            }
          }
        } catch (err) {
          if (!isCancelled) setError(err.message || 'Kurs ma\'lumotlarini yuklashda xatolik yuz berdi.');
        } finally {
          if (!isCancelled) setLoading(false);
        }
      } else {
        // Kurs bor, faqat lessonId o'zgargan - sahifani unmount qilmasdan darsni yangilaymiz!
        const lessons = course.lessons || [];
        if (lessons.length > 0 && lessonId) {
          const targetLesson = lessons.find(l => String(l.id) === String(lessonId));
          if (targetLesson && targetLesson.id !== currentLesson?.id) {
            fetchLessonDetail(targetLesson.id);
          }
        }
      }
    };

    fetchCourseData();

    return () => {
      isCancelled = true;
    };
  }, [courseSlug, lessonId]);

  const fetchLessonDetail = async (id) => {
    try {
      const data = await api.get(`/courses/lessons/${id}`);
      if (data.success && data.lesson) {
        setCurrentLesson(data.lesson);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Darslarni 4 ta modulga ajratish (HTML, CSS, JS, React)
  const rawModules = useMemo(() => {
    if (!course?.lessons) return [];
    return splitLessonsInto4Modules(course.lessons, courseSlug);
  }, [course?.lessons, courseSlug]);

  // Har bir modulning ochiq/qulflanganlik va test holati
  const modules = useMemo(() => {
    return checkModuleAccess(rawModules, courseSlug, user?.id, user?.role);
  }, [rawModules, courseSlug, user?.id, user?.role, quizRefreshToken]);

  // Faol dars tegishli modulni agar ochiq bo'lsa avtomatik faollashtirish (faqat shu modul ochiq qoladi)
  useEffect(() => {
    if (currentLesson && modules.length > 0) {
      const currentMod = modules.find(m => m.lessons.some(l => l.id === currentLesson.id));
      if (currentMod && currentMod.isUnlocked) {
        setExpandedModules({ [currentMod.id]: true });
      }
    }
  }, [currentLesson?.id, modules]);

  const toggleModule = (mod) => {
    if (!mod.isUnlocked && user?.role !== 'admin') {
      setLockedToast(`${mod.index}-Modul qulflangan! Avval ${mod.index - 1}-modul darslarini to'liq tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.`);
      setTimeout(() => setLockedToast(null), 4000);
      return;
    }
    setExpandedModules((prev) => {
      const isCurrentlyOpen = !!prev[mod.id];
      // Faqat bitta modul ochiq qoladi
      return isCurrentlyOpen ? {} : { [mod.id]: true };
    });
  };

  const handleSelectLesson = (lessonOrId, targetMod = null) => {
    const id = typeof lessonOrId === 'object' ? lessonOrId.id : lessonOrId;
    const mod = targetMod || modules.find(m => m.lessons.some(l => l.id === id));
    
    if (mod && !mod.isUnlocked && user?.role !== 'admin') {
      setLockedToast(`${mod.index}-Modul qulflangan! Ushbu darsni ko'rish uchun avvalgi modul darslarini va oraliq testini yakunlang.`);
      setTimeout(() => setLockedToast(null), 4000);
      return;
    }
    
    setIsSidebarOpen(false);
    navigate(`/courses/${courseSlug}/lesson/${id}`);
  };

  const handleQuizSuccess = ({ moduleIndex, score }) => {
    setQuizRefreshToken(prev => prev + 1);
    setQuizModal({ isOpen: false, moduleIndex: 1 });
    const nextModIndex = moduleIndex + 1;
    
    // Keyingi modulni faol qilib ochamiz (boshqalari yopiladi)
    setExpandedModules({
      [`mod-${nextModIndex}`]: true
    });

    // Yangi ochilgan modulning birinchi darsiga o'tamiz
    const nextMod = rawModules.find(m => m.index === nextModIndex);
    if (nextMod && nextMod.lessons.length > 0) {
      navigate(`/courses/${courseSlug}/lesson/${nextMod.lessons[0].id}`);
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !user) return;
    setCompleting(true);
    try {
      await api.post(`/courses/lessons/${currentLesson.id}/complete`);

      let updatedLessons = [];
      setCourse(prev => {
        if (!prev) return prev;
        updatedLessons = prev.lessons.map(l => l.id === currentLesson.id ? { ...l, is_completed: true } : l);
        return {
          ...prev,
          lessons: updatedLessons
        };
      });
      setCurrentLesson(prev => prev ? { ...prev, is_completed: true } : prev);

      // Ushbu dars qaysi modulga tegishli ekanligini topamiz
      const currentMod = modules.find(m => m.lessons.some(l => l.id === currentLesson.id));
      const modLessons = currentMod ? currentMod.lessons : [];

      // Shu modulning barcha darslari tugaganmi?
      const isModFinished = modLessons.length > 0 && modLessons.every(l => 
        l.id === currentLesson.id ? true : l.is_completed
      );

      const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
      const isLastLesson = currentIndex === course.lessons.length - 1;
      const allCompleted = updatedLessons.length > 0 && updatedLessons.every(l => l.is_completed);

      // Agar modul tugagan bo'lsa:
      if (isModFinished && currentMod) {
        if (currentMod.index < 4) {
          // Modul 1, 2, 3 tugaganda -> 10 ta savolli oraliq test modalini ko'rsatamiz!
          setQuizModal({ isOpen: true, moduleIndex: currentMod.index });
          return;
        } else if (currentMod.index === 4 && (allCompleted || isLastLesson)) {
          // Modul 4 (oxirgi modul) darslari tugaganda -> Yakuniy 20 ta savolli imtihon modalini chiqaramiz!
          setShowExamReadyModal(true);
          return;
        }
      }

      // Agar modul hali tugamagan bo'lsa, keyingi darsga o'tamiz
      if (currentIndex < course.lessons.length - 1) {
        const nextLesson = course.lessons[currentIndex + 1];
        handleSelectLesson(nextLesson, currentMod);
      }
    } catch (err) {
      console.error('Darsni yakunlashda xatolik:', err);
    } finally {
      setCompleting(false);
    }
  };

  // Interaktiv amaliy mashq uchun maxsus topshiriq ma'lumotlari
  const getPlaygroundData = () => {
    const slug = courseSlug?.toLowerCase() || 'html';
    const title = currentLesson?.title || 'Dars amaliyoti';

    if (slug === 'html') {
      return {
        taskTitle: `Amaliy Vazifa: ${title}`,
        taskDescription: "Quyidagi muharrirda semantik HTML teglari (h1, p, button) orqali o'z shaxsiy profilingiz yoki loyihangizning bosh sahifasi elementlarini yarating va tekshiring.",
        initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      padding: 24px;
      background: #0f172a;
      color: #f8fafc;
      text-align: center;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      margin: 0 auto;
    }
    h1 { color: #38bdf8; font-size: 20px; margin-bottom: 8px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
    .btn {
      display: inline-block;
      margin-top: 14px;
      background: #0284c7;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Salom, Men RunCode O'quvchisiman!</h1>
    <p>HTML asoslarini o'rganmoqdaman. Quyidagi kodni o'zgartiring va 'Ishga Tushirish' tugmasini bosing.</p>
    <button class="btn" onclick="alert('Zo\\'r natija!')">Meni Bosing</button>
  </div>
</body>
</html>`,
        validationRule: (code) => code.includes('<h1') && (code.includes('<p') || code.includes('<button'))
      };
    }

    if (slug === 'css') {
      return {
        taskTitle: `Amaliy Dizayn Vazifasi: ${title}`,
        taskDescription: "CSS uslublari (ranglar, border-radius, flexbox yoki animatsiya) yordamida zamonaviy interfeys elementini yasang.",
        initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #090d16;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: sans-serif;
      margin: 0;
    }
    .badge {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      padding: 16px 28px;
      border-radius: 9999px;
      font-weight: bold;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
      transition: transform 0.3s ease;
      cursor: pointer;
    }
    .badge:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="badge">RunCode CSS Master</div>
</body>
</html>`,
        validationRule: (code) => code.includes('style') && (code.includes('background') || code.includes('color'))
      };
    }

    if (slug === 'javascript') {
      return {
        taskTitle: `JS Skript Vazifasi: ${title}`,
        taskDescription: "Interaktiv hisoblagich yoki funksiyani yozing va konsolda natijani tekshiring.",
        initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0b0f19; color: #fff; font-family: sans-serif; text-align: center; padding: 40px; }
    button { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 16px; cursor: pointer; }
    #display { font-size: 32px; font-weight: bold; margin: 20px; color: #60a5fa; }
  </style>
</head>
<body>
  <h2>JavaScript Hisoblagich</h2>
  <div id="display">0</div>
  <button id="counterBtn">Qiymatni oshirish (+1)</button>

  <script>
    let count = 0;
    const btn = document.getElementById('counterBtn');
    const display = document.getElementById('display');

    btn.addEventListener('click', () => {
      count++;
      display.textContent = count;
      console.log('Hozirgi hisob:', count);
    });
  </script>
</body>
</html>`,
        validationRule: (code) => code.includes('<script') && (code.includes('addEventListener') || code.includes('function') || code.includes('count'))
      };
    }

    // React fallback
    return {
      taskTitle: `React UI Vazifasi: ${title}`,
      taskDescription: "Oddiy interfeys komponentini yarating va interaktiv rejimda tekshirib ko'ring.",
      initialCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .box { background: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #334155; text-align: center; }
  </style>
</head>
<body>
  <div class="box">
    <h3 style="color: #38bdf8;">React Komponenti</h3>
    <p style="color: #94a3b8;">Zamonaviy veb ilovalar uchun komponentlar arxitekturasi</p>
  </div>
</body>
</html>`,
      validationRule: (code) => code.includes('React') || code.includes('Komponent') || code.includes('style')
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-xs font-semibold text-gray-500">Kurs darslari yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container-custom py-24 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Darslikka kirish cheklangan</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{error || 'Kurs topilmadi'}</p>
        {course?.is_premium && !hasSubscription && (
          <button
            onClick={() => onOpenPaymentModal ? onOpenPaymentModal('1_month') : navigate('/tariffs')}
            className="mt-4 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-xs cursor-pointer"
          >
            Obunani Faollashtirish
          </button>
        )}
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
  const completedCount = course.lessons.filter(l => l.is_completed).length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
  const isAllLessonsCompleted = course.lessons.length > 0 && completedCount === course.lessons.length;
  const playgroundData = getPlaygroundData();

  // Joriy dars qaysi modulga tegishli va u ochiqmi?
  const currentMod = modules.find(m => m.lessons.some(l => l.id === currentLesson?.id));
  const isCurrentLessonLocked = currentMod && !currentMod.isUnlocked && user?.role !== 'admin';

  return (
    <div className="container-custom py-8 relative">
      {/* Darslik himoya qalqoni (Screenshot & Snipping Tool & Copy blocker) */}
      <SecurityCurtain 
        isPrtScnTriggered={isPrtScnTriggered} 
        isWindowBlurred={isWindowBlurred} 
        warningMessage={warningMessage} 
      />

      {/* Qulflangan ogohlantirish toasti */}
      {lockedToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-2xl flex items-center space-x-2 animate-in slide-in-from-top-4">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>{lockedToast}</span>
        </div>
      )}
      
      {/* Top Breadcrumb & Mobile Toggle */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/5 mb-6">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Link to="/courses" className="hover:text-brand-500 transition-colors">Kurslar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to={`/courses/${courseSlug}`}
            className="flex items-center space-x-1.5 font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition-colors truncate"
            title="Kurs haqida umumiy ma'lumot sahifasi"
          >
            {renderTechLogo(courseSlug, 'w-4 h-4')}
            <span>{course.title}</span>
          </Link>
          {currentLesson && (
            <>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="text-brand-600 dark:text-brand-400 hidden sm:inline truncate max-w-xs">{currentLesson.title}</span>
            </>
          )}
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold flex items-center space-x-1.5 bg-white dark:bg-white/5 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-brand-500" />
          <span>Bo'limlar ({completedCount}/{course.lessons.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
        
        {/* Sidebar: Modular Lessons Syllabus (4 Modulga ajratilgan, Sticky & Chiroyli dizayn) */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-80 bg-white/95 dark:bg-[#0c0d12]/95 backdrop-blur-2xl border-l border-gray-200 dark:border-white/10 p-5 sm:p-6 transform transition-transform lg:sticky lg:top-24 lg:transform-none lg:w-auto lg:col-span-4 lg:p-5 lg:rounded-3xl lg:border lg:block min-w-0 lg:max-h-[calc(100vh-7rem)] lg:flex lg:flex-col shadow-2xl lg:shadow-sm ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Header - Fixed inside sticky container */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-white/5 mb-3.5 flex-shrink-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Kurs Bo'limlari & Darslar</h3>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">4 ta bosqichli modul &middot; {course.lessons.length} ta dars</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar - Fixed inside sticky container */}
          <div className="mb-4 space-y-1.5 flex-shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
              <span>Umumiy O'zlashtirish:</span>
              <span className="text-brand-500 font-black">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden p-0.5 border border-gray-200/50 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Modules Accordion List (Scrollable inside sticky container) */}
          <div className="flex-1 overflow-y-auto pr-1.5 space-y-3 custom-scrollbar">
            {modules.map((mod) => {
              const isExpanded = !!expandedModules[mod.id];
              const isLocked = !mod.isUnlocked && user?.role !== 'admin';
              const hasActiveLesson = mod.lessons.some(l => l.id === currentLesson?.id);
              const modProgress = Math.round((mod.completedCount / mod.lessons.length) * 100);

              return (
                <div 
                  key={mod.id} 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    hasActiveLesson && !isLocked
                      ? 'border-brand-500/40 bg-brand-500/[0.03] dark:bg-brand-500/[0.04] shadow-md shadow-brand-500/5'
                      : isLocked 
                      ? 'border-gray-200/60 dark:border-white/[0.04] bg-gray-50/50 dark:bg-white/[0.01] opacity-75' 
                      : 'border-gray-200/80 dark:border-white/[0.07] bg-white dark:bg-[#11131c]/90 hover:border-gray-300 dark:hover:border-white/10'
                  }`}
                >
                  {/* Module Header Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer ${
                      isExpanded 
                        ? 'bg-gray-50/90 dark:bg-white/[0.03]' 
                        : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {isLocked ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Lock className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{mod.index}-Modul (Qulflangan)</span>
                          </span>
                        ) : mod.hasPassedQuiz ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{mod.index}-Modul (Tugatildi)</span>
                          </span>
                        ) : mod.needsQuiz ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                            <Award className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>Test Kutilmoqda</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                            {mod.index}-Modul
                          </span>
                        )}

                        {hasActiveLesson && !isLocked && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/20">
                            Hozirgi dars
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold leading-snug truncate ${
                        isLocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {mod.title}
                      </h4>

                      {/* Mini progress bar inside module header */}
                      {!isLocked && (
                        <div className="w-full bg-gray-200/60 dark:bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-brand-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${modProgress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">
                        {mod.completedCount}/{mod.lessons.length}
                      </span>
                      <div className={`p-1.5 rounded-lg transition-transform duration-300 ease-in-out transform ${
                        isExpanded ? 'rotate-180 bg-brand-500/10 text-brand-500' : 'rotate-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                      }`}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>

                  {/* Module Lessons with Smooth Collapse / Expand Animation */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-2 space-y-1 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/20">
                        {isLocked ? (
                          /* Locked State Message */
                          <div className="p-3 text-center space-y-1.5 bg-amber-500/[0.04] rounded-xl border border-amber-500/10 m-1">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                              <Lock className="w-4 h-4" />
                            </div>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {mod.index}-Modul qulflangan
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                              {mod.index - 1}-modul darslarini tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.
                            </p>
                          </div>
                        ) : (
                          /* Lessons List */
                          <>
                            {mod.lessons.map((lesson) => {
                              const isActive = currentLesson?.id === lesson.id;
                              const overallIndex = course.lessons.findIndex(l => l.id === lesson.id) + 1;

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => handleSelectLesson(lesson, mod)}
                                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer transform ${
                                    isActive
                                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25 scale-[1.01]'
                                      : 'hover:bg-gray-100/80 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 hover:translate-x-1'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5 truncate mr-2">
                                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                      isActive 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-gray-200/80 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                    }`}>
                                      {overallIndex}
                                    </span>
                                    <span className="truncate">{lesson.title}</span>
                                  </div>

                                  <div className="flex-shrink-0">
                                    {lesson.is_completed ? (
                                      <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                                    ) : (
                                      <Circle className={`w-4 h-4 ${isActive ? 'text-white/60' : 'text-gray-300 dark:text-gray-600'}`} />
                                    )}
                                  </div>
                                </button>
                              );
                            })}

                            {/* Oraliq Test Blok (1, 2, 3 modullar uchun) */}
                            {mod.index < 4 && (
                              <div className="pt-2">
                                {mod.needsQuiz ? (
                                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-amber-600/15 border border-amber-500/30 space-y-2 shadow-sm animate-in fade-in">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black uppercase text-amber-500 flex items-center space-x-1">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                                        <span>{mod.index}-Modul Yakunlandi</span>
                                      </span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30">
                                        10 Savol
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                                      Keyingi <strong>{mod.index + 1}-Modulni</strong> ochish uchun oraliq testdan kamida 70% to'plang!
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => setQuizModal({ isOpen: true, moduleIndex: mod.index })}
                                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                                    >
                                      <Award className="w-4 h-4" />
                                      <span>Oraliq testni topshirish</span>
                                    </button>
                                  </div>
                                ) : mod.hasPassedQuiz ? (
                                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400">
                                    <span className="flex items-center space-x-1.5 font-bold">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>Oraliq test topshirildi</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setQuizModal({ isOpen: true, moduleIndex: mod.index })}
                                      className="text-[10px] underline hover:text-emerald-500 font-semibold cursor-pointer"
                                    >
                                      Qayta ko'rish
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Exam CTA (20 ta savol) - Fixed at bottom of sticky sidebar */}
          <div className="pt-3.5 border-t border-gray-100 dark:border-white/5 mt-3.5 flex-shrink-0">
            {isAllLessonsCompleted ? (
              <button
                type="button"
                onClick={() => navigate(`/courses/${courseSlug}/exam`)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 animate-pulse"
              >
                <Award className="w-4 h-4" />
                <span>Yakuniy Imtihon (20 ta savol)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLockedToast(`Yakuniy imtihon qulflangan! Imtihonga kirish uchun kursdagi barcha ${course.lessons.length} ta darsni to'liq yakunlang (Hozirda: ${completedCount}/${course.lessons.length}).`);
                  setTimeout(() => setLockedToast(null), 4000);
                }}
                className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer hover:border-amber-500/40 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Yakuniy Imtihon ({completedCount}/{course.lessons.length})</span>
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-8 min-w-0 max-w-full space-y-8">
          {isCurrentLessonLocked ? (
            /* Current Lesson is in Locked Module */
            <div className="bg-white dark:bg-[#0c0d12]/90 p-8 sm:p-12 rounded-3xl border border-amber-500/20 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {currentMod?.index}-Modul Hozircha Qulflangan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Ushbu darsga kirish uchun oldingi modulni yakunlang
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {currentMod ? currentMod.index - 1 : 1}-modul darslarini to'liq ko'rib chiqib, 10 ta savolli oraliq testdan kamida 70% to'plashingiz kerak.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const latestUnlocked = [...modules].filter(m => m.isUnlocked).pop();
                    if (latestUnlocked && latestUnlocked.lessons.length > 0) {
                      navigate(`/courses/${courseSlug}/lesson/${latestUnlocked.lessons[0].id}`);
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
                >
                  Ochiq darslarga qaytish
                </button>
              </div>
            </div>
          ) : currentLesson ? (
            <div className="bg-white dark:bg-[#0c0d12]/90 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm space-y-8 relative overflow-hidden protected-content">
              {/* Dinamik Foydalanuvchi Watermark (Skrinshot va rasmga olishdan himoya) */}
              <WatermarkOverlay />

              {/* Lesson Title & Status */}
              <div className="border-b border-gray-100 dark:border-white/5 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    {renderTechLogo(courseSlug, 'w-4 h-4')}
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {course.title} &middot; {currentIndex + 1}-Dars
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
                    {currentLesson.title}
                  </h1>
                </div>

                {/* Mark as Completed Button */}
                {user && (
                  <button
                    onClick={handleCompleteLesson}
                    disabled={completing}
                    className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                      currentLesson.is_completed
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentLesson.is_completed ? 'Tugatilgan' : 'Darsni Yakunlash'}</span>
                  </button>
                )}
              </div>

              {/* Lesson Markdown Content */}
              <MarkdownViewer content={currentLesson.content_markdown} />

              {/* Interactive Code Playground / Amaliy Mashg'ulot */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <CodePlayground
                  taskTitle={playgroundData.taskTitle}
                  taskDescription={playgroundData.taskDescription}
                  initialCode={playgroundData.initialCode}
                  validationRule={playgroundData.validationRule}
                  onSuccess={() => {
                    if (user && !currentLesson.is_completed) {
                      handleCompleteLesson();
                    }
                  }}
                />
              </div>

              {/* Prev / Next Lesson Navigation & Quiz CTAs */}
              <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                {prevLesson ? (
                  <button
                    onClick={() => handleSelectLesson(prevLesson.id)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Oldingi dars</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  {/* Agar joriy modul darslari tugagan bo'lsa va oraliq test topshirilishi kerak bo'lsa */}
                  {currentMod && currentMod.needsQuiz && currentMod.index < 4 && (
                    <button
                      type="button"
                      onClick={() => setQuizModal({ isOpen: true, moduleIndex: currentMod.index })}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/25 flex items-center space-x-1.5 transition-all cursor-pointer animate-pulse"
                    >
                      <Award className="w-4 h-4" />
                      <span>{currentMod.index}-Modul Oraliq Testi (10 ta)</span>
                    </button>
                  )}

                  {nextLesson ? (
                    <button
                      onClick={() => {
                        const nextMod = modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
                        if (nextMod && !nextMod.isUnlocked && currentMod) {
                          setQuizModal({ isOpen: true, moduleIndex: currentMod.index });
                          return;
                        }
                        handleSelectLesson(nextLesson.id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Keyingi dars</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : isAllLessonsCompleted ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${courseSlug}/exam`)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Yakuniy Imtihonni Boshlash</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setLockedToast(`Yakuniy imtihonga kirish uchun kursdagi barcha ${course.lessons.length} ta darsni to'liq yakunlang (Hozirda: ${completedCount}/${course.lessons.length}).`);
                        setTimeout(() => setLockedToast(null), 4000);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:border-amber-500/30"
                    >
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Imtihon ({completedCount}/${course.lessons.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0c0d12] p-12 rounded-3xl border border-gray-200 dark:border-white/5 text-center">
              <p className="text-xs text-gray-500">Dars tanlang</p>
            </div>
          )}
        </main>
      </div>

      {/* Oraliq Modul Testi Modali (10 ta savol) */}
      <ModuleQuizModal
        isOpen={quizModal.isOpen}
        onClose={() => setQuizModal({ isOpen: false, moduleIndex: 1 })}
        courseSlug={courseSlug}
        moduleIndex={quizModal.moduleIndex}
        userId={user?.id || 'guest'}
        onSuccess={handleQuizSuccess}
      />

      {/* Yakuniy Imtihonga Tayyormisiz Modali (4-Modul tugaganda va 20 ta savol) */}
      {showExamReadyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 sm:p-8 bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl text-center space-y-6">
            
            {/* Yopish tugmasi */}
            <button
              onClick={() => setShowExamReadyModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Nishon / Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce">
              <Award className="w-10 h-10" />
              <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-yellow-100" />
            </div>

            {/* Matn va Tavsif */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Kurs Darslari To'liq Yakunlandi (100%)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-2">
                Tabriklaymiz! Siz ushbu kursni to'liq tugatdingiz!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Barcha <strong>4 ta modul va {course.lessons.length} ta dars</strong> muvaffaqiyatli yakunlandi. Endi o'zlashtirgan bilimlaringizni sinovdan o'tkazish uchun <strong>Yakuniy Imtihonga tayyormisiz?</strong>
              </p>
            </div>

            {/* Imtihon qisqacha ma'lumoti */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-around text-xs">
              <div>
                <p className="text-gray-400 text-[10px]">Savollar soni</p>
                <p className="font-bold text-gray-900 dark:text-white">20 ta savol</p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
              <div>
                <p className="text-gray-400 text-[10px]">O'tish bali</p>
                <p className="font-bold text-emerald-500">70% va yuqori</p>
              </div>
            </div>

            {/* Harakat Tugmalari */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExamReadyModal(false);
                  navigate(`/courses/${courseSlug}/exam`);
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Award className="w-4 h-4" />
                <span>Imtihonni Boshlash</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExamReadyModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
              >
                Keyinroq topshiraman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
