import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft, 
  BookOpen,
  Loader2,
  ShieldCheck,
  Lock,
  Timer
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSecurityShield } from '../hooks/useSecurityShield';
import { WatermarkOverlay } from '../components/WatermarkOverlay';
import { SecurityCurtain } from '../components/SecurityCurtain';

export const ExamPage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Imtihon ichida anti-copy, anti-screenshot va test o'g'irlashga qarshi himoya
  const { isPrtScnTriggered, isWindowBlurred, warningMessage } = useSecurityShield({
    enableAntiCopy: true,
    enableAntiScreenshot: true,
    enableBlurShield: true
  });

  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lockedInfo, setLockedInfo] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [reviewFilter, setReviewFilter] = useState('all');

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      setError(null);
      setLockedInfo(null);
      try {
        const data = await api.get(`/exams/course/${courseSlug}`);
        if (data.success) {
          setExamData(data.exam);
          setQuestions(data.questions || []);
        }
      } catch (err) {
        if (err.status === 403 || err.response?.status === 403 || err.response?.data?.locked) {
          setLockedInfo(err.response?.data || { message: err.message, locked: true });
        } else {
          setError(err.message || 'Imtihon ma\'lumotlarini yuklashda xatolik yuz berdi');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [courseSlug]);

  // Jonli imtihon taymeri (Sekundomer)
  useEffect(() => {
    let interval = null;
    if (!result && !loading && questions.length > 0 && !lockedInfo) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [result, loading, questions, lockedInfo]);

  const formatTimerDigital = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeWords = (totalSec) => {
    if (!totalSec || totalSec <= 0) return '1 daqiqa ichida';
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs} soniya`;
    if (secs === 0) return `${mins} daqiqa`;
    return `${mins} daq ${secs} son`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      setError(`Iltimos, barcha ${questions.length} ta savolga javob bering. (Hozirda: ${Object.keys(answers).length}/${questions.length})`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = await api.post('/exams/submit', {
        examId: examData.id,
        answers,
        timeSpentSeconds: secondsElapsed
      });

      if (data.success) {
        setResult(data);
        if (data.score >= 70) {
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Natijani yuborishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setError(null);
    setSecondsElapsed(0);
    setReviewFilter('all');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (loading) {
    return (
      <div className="container-custom py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-xs text-gray-400">Imtihon savollari yuklanmoqda...</p>
      </div>
    );
  }

  // 1. Darslar to'liq tugatilmagan bo'lsa (Imtihon qulflangan holat)
  if (lockedInfo) {
    const comp = lockedInfo.completionStatus;
    const completed = comp?.completedLessons || 0;
    const total = comp?.totalLessons || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
      <div className="container-custom py-20 max-w-lg mx-auto text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Imtihon Qulflangan
          </span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Avval Barcha Darslarni Tugating
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {lockedInfo.message || "Ushbu kursning yakuniy imtihoniga kirish uchun barcha darslarni to'liq yakunlashingiz kerak."}
          </p>
        </div>

        {total > 0 && (
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0c101c] border border-gray-200 dark:border-white/10 space-y-3 text-xs shadow-sm">
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-500">Tugatilgan darslar:</span>
              <span className="text-brand-500 font-mono text-sm">
                {completed} / {total} ({percent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Qolgan darslar: {comp?.remaining || (total - completed)} ta dars
            </p>
          </div>
        )}

        <div>
          <Link
            to={`/courses/${courseSlug}/learn`}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Darslarga qaytish va yakunlash</span>
          </Link>
        </div>
      </div>
    );
  }

  if (error && !examData) {
    return (
      <div className="container-custom py-24 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Imtihon mavjud emas</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{error}</p>
        <Link
          to={`/courses/${courseSlug}`}
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Kursga qaytish</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 max-w-3xl mx-auto space-y-8 relative overflow-hidden protected-content">
      {/* Imtihon xavfsizlik qalqoni */}
      <SecurityCurtain 
        isPrtScnTriggered={isPrtScnTriggered} 
        isWindowBlurred={isWindowBlurred} 
        warningMessage={warningMessage} 
      />

      {/* Dinamik foydalanuvchi suv belgisi (Watermark) */}
      <WatermarkOverlay />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-brand-500 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kurs darslariga qaytish</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {examData.courseTitle} — Yakuniy Imtihoni
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Jami {questions.length} ta savol &middot; O'tish bali: {examData.passingScore}%
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!result && (
            <div className="px-3.5 py-2 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 font-mono font-bold text-xs flex items-center space-x-1.5 shadow-sm">
              <Clock className="w-4 h-4 text-brand-500 animate-pulse" />
              <span>Vaqt: {formatTimerDigital(secondsElapsed)}</span>
            </div>
          )}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Award className="w-7 h-7" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card va Savollar Tahlili */}
      {result ? (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Banner / Verdict */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c101c] border border-gray-200 dark:border-white/10 shadow-xl text-center space-y-6">
            {result.status === 'passed' ? (
              <>
                <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Muvaffaqiyatli topshirildi
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-3">
                    Ajoyib Natija! {result.score}%
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-lg mx-auto leading-relaxed">
                    {result.message}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Boshqa kurslarga o'tish</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                    <span>Qaytadan topshirish</span>
                  </button>
                </div>
              </>
            ) : result.status === 'reexam' ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Qayta topshirish (Re-Exam)
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3">
                    Natijangiz: {result.score}%
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-lg mx-auto leading-relaxed">
                    Siz 60% dan 69% gacha ball to'pladingiz. Kursni muvaffaqiyatli tamomlash uchun kamida 70% kerak bo'ladi. Xatolaringizni quyida ko'rib chiqib, qayta topshiring!
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qaytadan Topshirish (Re-exam)</span>
                  </button>
                  <Link
                    to={`/courses/${courseSlug}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Darslarni takrorlash</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    Yetarli emas
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3">
                    Natijangiz: {result.score}%
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-lg mx-auto leading-relaxed">
                    Afsuski, natijangiz 60% dan past bo'ldi. Quyidagi tahlil orqali qaysi savollarda xato qilganingizni bilib oling va darslarni qaytadan o'qib chiqing.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qayta urinib ko'rish</span>
                  </button>
                  <Link
                    to={`/courses/${courseSlug}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center space-x-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Darslarni Qaytadan O'qish</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* 5 Stats Cards: Jami, To'g'ri, Xato, Ball, Sarflangan Vaqt */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-gray-200 dark:border-white/10 text-center shadow-sm">
              <div className="flex items-center justify-center mb-1 text-gray-400">
                <BookOpen className="w-3.5 h-3.5 mr-1 text-brand-500" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Jami Savol</span>
              </div>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                {result.totalQuestions || questions.length} <span className="text-xs font-normal text-gray-400">ta</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-center shadow-sm">
              <div className="flex items-center justify-center mb-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">To'g'ri</span>
              </div>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {result.correctCount !== undefined ? result.correctCount : Math.round(((result.score || 0) / 100) * questions.length)} <span className="text-xs font-normal text-emerald-500/70">ta</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-center shadow-sm">
              <div className="flex items-center justify-center mb-1 text-rose-600 dark:text-rose-400">
                <XCircle className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Xato</span>
              </div>
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                {result.incorrectCount !== undefined ? result.incorrectCount : Math.max(0, (questions.length - (result.correctCount || 0)))} <span className="text-xs font-normal text-rose-500/70">ta</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-center shadow-sm">
              <div className="flex items-center justify-center mb-1 text-amber-600 dark:text-amber-400">
                <Award className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Ball</span>
              </div>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                {result.score}%
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-brand-500/5 dark:bg-brand-950/20 border border-brand-500/20 text-center shadow-sm">
              <div className="flex items-center justify-center mb-1 text-brand-600 dark:text-brand-400">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Sarflangan Vaqt</span>
              </div>
              <p className="text-xl font-black text-brand-600 dark:text-brand-400">
                {formatTimerDigital(result.timeSpentSeconds || secondsElapsed)}
              </p>
            </div>
          </div>

          {/* Savollar Tahlili (Review bo'limi) */}
          {(() => {
            const detailsList = result.details || questions.map((q, idx) => {
              const userAnswer = answers[q.id] !== undefined ? parseInt(answers[q.id], 10) : null;
              const isCorrect = userAnswer !== null && userAnswer === q.correct_option;
              return {
                questionId: q.id,
                index: idx + 1,
                question: q.question,
                options: q.options,
                userAnswer,
                correctOption: q.correct_option,
                isCorrect
              };
            });

            const filteredList = detailsList.filter((item) => {
              if (reviewFilter === 'correct') return item.isCorrect;
              if (reviewFilter === 'incorrect') return !item.isCorrect;
              return true;
            });

            const totalCorrect = detailsList.filter(d => d.isCorrect).length;
            const totalIncorrect = detailsList.filter(d => !d.isCorrect).length;

            return (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Sparkles className="w-5 h-5 text-brand-500 mr-2" />
                      Savollar Bo'yicha Tahlil
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Har bir savolga berilgan javoblaringiz va to'g'ri variantlar
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        reviewFilter === 'all'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Barchasi ({detailsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('correct')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        reviewFilter === 'correct'
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      To'g'rilari ({totalCorrect})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('incorrect')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        reviewFilter === 'incorrect'
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                          : 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
                      }`}
                    >
                      Xatolari ({totalIncorrect})
                    </button>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {filteredList.map((item) => (
                    <div
                      key={item.questionId}
                      className={`p-6 rounded-3xl border transition-all ${
                        item.isCorrect
                          ? 'bg-white dark:bg-[#0c101c] border-emerald-500/30 shadow-sm shadow-emerald-500/5'
                          : 'bg-white dark:bg-[#0c101c] border-rose-500/30 shadow-sm shadow-rose-500/5'
                      }`}
                    >
                      {/* Savol sarlavhasi */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.isCorrect
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}>
                            {item.index}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">
                            {item.question}
                          </p>
                        </div>

                        {item.isCorrect ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center space-x-1 flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>To'g'ri</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center space-x-1 flex-shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Xato</span>
                          </span>
                        )}
                      </div>

                      {/* Variantlar ro'yxati */}
                      <div className="space-y-2 pt-1 pl-10">
                        {item.options.map((opt, optIdx) => {
                          const isCorrectOption = optIdx === item.correctOption;
                          const isUserChoice = optIdx === item.userAnswer;

                          let optionStyle = 'border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-400 opacity-70';
                          let indicator = null;

                          if (isCorrectOption) {
                            optionStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30';
                            indicator = (
                              <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> To'g'ri javob
                              </span>
                            );
                          } else if (isUserChoice && !item.isCorrect) {
                            optionStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-500/30';
                            indicator = (
                              <span className="ml-auto px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white flex items-center">
                                <XCircle className="w-3 h-3 mr-1" /> Sizning javobingiz
                              </span>
                            );
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-2xl text-xs sm:text-sm border flex items-center space-x-3 transition-all ${optionStyle}`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                isCorrectOption
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : isUserChoice
                                  ? 'border-rose-500 bg-rose-500 text-white'
                                  : 'border-gray-400 dark:border-gray-600'
                              }`}>
                                {(isCorrectOption || isUserChoice) && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="leading-relaxed">{opt}</span>
                              {indicator}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        /* Test Savollari Formasi */
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-between">
            <span className="font-semibold">Barcha savollarni diqqat bilan o'qib javob bering.</span>
            <span className="font-bold">{Object.keys(answers).length}/{questions.length} belgilandi</span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-medium border flex items-center space-x-3 transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold ring-2 ring-brand-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-400'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            <span>Imtihon Natijasini Tekshirish & Yuborish</span>
          </button>
        </form>
      )}

    </div>
  );
};
