import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { splitLessonsInto4Modules, checkModuleAccess } from '../data/courseQuizzes';
import { COURSE_STATIC_INFO } from '../data/courseStaticInfo';
import { CourseDetailHero } from '../components/course/CourseDetailHero';
import { CourseModulesAccordion } from '../components/course/CourseModulesAccordion';
import { CourseDetailSidebar } from '../components/course/CourseDetailSidebar';

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
    return (staticInfo.fallbackModules || []).map((m, idx) => ({
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

  const isUpcoming = staticInfo.isUpcoming;

  const modules = useMemo(() => {
    if (isUpcoming) {
      return rawModules.map((m) => ({ ...m, isUnlocked: true }));
    }
    return checkModuleAccess(rawModules, courseSlug, user?.id, user?.role);
  }, [rawModules, courseSlug, user?.id, user?.role, isUpcoming]);

  // Dastlabki 1-modulni avtomatik ochib qo'yish (boshqa modullar yopiq)
  useEffect(() => {
    if (modules.length > 0) {
      setExpandedModules({ [modules[0].id]: true });
    }
  }, [courseSlug, modules.length]);

  const toggleModule = (mod) => {
    if (!mod.isUnlocked && user?.role !== 'admin' && !isUpcoming) {
      setToastMessage(`${mod.index}-Modul qulflangan! Avval ${mod.index - 1}-modul darslarini to'liq tugatib, 10 ta savolli oraliq testdan kamida 70% to'plang.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    setExpandedModules((prev) => {
      const isCurrentlyOpen = !!prev[mod.id];
      return isCurrentlyOpen ? {} : { [mod.id]: true };
    });
  };

  const isPremium = dbCourse ? dbCourse.is_premium : staticInfo.is_premium;
  const canAccess = !isPremium || hasSubscription;

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

        <CourseDetailHero
          title={dbCourse?.title || staticInfo.title}
          category={staticInfo.category}
          level={staticInfo.level}
          isUpcoming={isUpcoming}
          duration={staticInfo.duration}
          studentsCount={staticInfo.studentsCount}
          modulesCount={modules.length}
        />

        {/* Asosiy 2 Ustunli Tarkib */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chap Tomon: Kurs haqida & Kurs dasturi (8 ta ustun) */}
          <div className="lg:col-span-8">
            <CourseModulesAccordion
              description={dbCourse?.description || staticInfo.description}
              techTags={staticInfo.techTags}
              modules={modules}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              handleLessonClick={handleLessonClick}
              user={user}
              isUpcoming={isUpcoming}
              isPremium={isPremium}
              canAccess={canAccess}
            />
          </div>

          {/* O'ng Tomon: Qalqib Turuvchi Tarif & Kirish Kartochkasi (4 ta ustun) */}
          <div className="lg:col-span-4 sticky top-24">
            <CourseDetailSidebar
              isUpcoming={isUpcoming}
              isPremium={isPremium}
              hasSubscription={hasSubscription}
              user={user}
              canAccess={canAccess}
              handleStartCourse={handleStartCourse}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
