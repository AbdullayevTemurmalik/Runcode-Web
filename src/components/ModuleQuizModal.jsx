import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  X, 
  Clock, 
  Check, 
  BookOpen, 
  Unlock,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { MODULE_INTERIM_QUIZZES, saveCourseQuizResult } from '../data/courseQuizzes';

export const ModuleQuizModal = ({
  isOpen,
  onClose,
  courseSlug = 'html',
  moduleIndex = 1,
  lessonId = null,
  lessonTitle = '',
  userId = 'guest',
  onSuccess
}) => {
  const quizConfig = MODULE_INTERIM_QUIZZES[courseSlug]?.[moduleIndex];

  const [backendQuiz, setBackendQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 daqiqa (600 sek)
  const [showReview, setShowReview] = useState(false);

  // Backenddan dars bo'yicha progressiv savollarni yuklash
  useEffect(() => {
    if (isOpen && lessonId) {
      setLoadingQuiz(true);
      api.get(`/courses/lessons/${lessonId}/quiz`)
        .then(res => {
          if (res.success && res.questions) {
            setBackendQuiz(res);
            // Savollar soniga qarab dinamik taymer: har bir savol uchun 1 daqiqa
            const count = res.questions.length || 5;
            setTimeLeft(Math.max(300, count * 60));
          }
        })
        .catch(err => {
          console.error('Darslik testi yuklanmadi:', err);
        })
        .finally(() => {
          setLoadingQuiz(false);
        });
    } else {
      setBackendQuiz(null);
    }
  }, [isOpen, lessonId]);

  // Reset holat
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setSubmitted(false);
      setResult(null);
      setTimeLeft(600);
      setShowReview(false);
    }
  }, [isOpen, courseSlug, moduleIndex, lessonId]);

  // Taymer
  useEffect(() => {
    if (!isOpen || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, submitted]);

  if (!isOpen) return null;

  // Faol savollar ro'yxati
  const questions = lessonId ? (backendQuiz?.questions || []) : (quizConfig?.questions || []);
  const currentQuestion = questions[currentIndex];
  const targetNextModule = moduleIndex + 1;

  const handleSelectOption = (optionIdx) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (submittingQuiz || submitted) return;

    // 1. Darslik bo'yicha test (Backend Source of Truth)
    if (lessonId) {
      setSubmittingQuiz(true);
      try {
        const answersPayload = {};
        questions.forEach((q, idx) => {
          if (answers[idx] !== undefined) {
            answersPayload[q.id] = answers[idx];
          }
        });

        const res = await api.post(`/courses/lessons/${lessonId}/quiz-submit`, {
          answers: answersPayload
        });

        const resultData = {
          score: res.score || 0,
          correctCount: res.correctCount || 0,
          totalQuestions: res.totalQuestions || questions.length,
          passed: !!res.passed,
          passingScore: res.passingScore || 70,
          message: res.message
        };

        setResult(resultData);
        setSubmitted(true);

        if (res.passed) {
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          if (onSuccess) onSuccess({ lessonId, score: res.score, passed: true });
        }
      } catch (err) {
        console.error('Quiz topshirishda xatolik:', err);
      } finally {
        setSubmittingQuiz(false);
      }
      return;
    }

    // 2. Modul oraliq testi fallback
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) {
        correctCount += 1;
      }
    });

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= (quizConfig?.passingScore || 70);

    const res = {
      score,
      correctCount,
      totalQuestions,
      passed,
      passingScore: quizConfig?.passingScore || 70
    };

    setResult(res);
    setSubmitted(true);

    if (passed) {
      saveCourseQuizResult(courseSlug, moduleIndex, res, userId);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
      if (onSuccess) onSuccess({ moduleIndex, score, passed: true });
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setTimeLeft(questions.length * 60 || 600);
    setShowReview(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Header sarlavhalari
  const displayTitle = lessonId
    ? (lessonTitle || backendQuiz?.quiz?.lessonTitle || "Darslik Imtihoni")
    : (quizConfig?.title || `${moduleIndex}-Modul Oraliq Testi`);

  const displaySubtitle = lessonId
    ? `Dars yakuniy progressiv testi: ${questions.length} ta savol (${backendQuiz?.quiz?.lessonIndexInModule || 1} × 5 ta savol)`
    : (quizConfig?.scopeText || "Modulda o'tilgan mavzular bo'yicha");

  const badgeText = lessonId
    ? `${backendQuiz?.quiz?.moduleIndex || moduleIndex}-Modul • ${backendQuiz?.quiz?.lessonIndexInModule || 1}-Dars`
    : `${moduleIndex}-Modul Oraliq Testi`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#0f1117] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-500">
                  {badgeText}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                  {lessonId ? "Darsni Yakunlash" : `${targetNextModule}-Modulga O'tish`}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                {displayTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!submitted && !loadingQuiz && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loadingQuiz ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Savollar banki yuklanmoqda...
              </p>
            </div>
          ) : !submitted ? (
            <>
              {/* Scope & Instructions */}
              <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 flex items-start space-x-3 text-xs">
                <BookOpen className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5 text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {displaySubtitle}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    O'tish talabi: {questions.length} ta savoldan kamida <strong>70%</strong> to'g'ri javob bering.
                  </p>
                </div>
              </div>

              {/* Progress & Stepper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Savol: <strong className="text-gray-900 dark:text-white">{currentIndex + 1}</strong> / {questions.length}</span>
                  <span>Javob berildi: <strong className="text-brand-500">{answeredCount}</strong> / {questions.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Quick Jump Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {questions.map((_, qIdx) => {
                    const isAnswered = answers[qIdx] !== undefined;
                    const isCurrent = currentIndex === qIdx;
                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => setCurrentIndex(qIdx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-brand-600 text-white ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0f1117]'
                            : isAnswered
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question */}
              {currentQuestion && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                      Savol #{currentIndex + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-1 leading-snug">
                      {currentQuestion.question}
                    </h4>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((option, optIdx) => {
                      const isSelected = answers[currentIndex] === optIdx;
                      const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center space-x-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 shadow-sm'
                              : 'bg-white dark:bg-[#131620] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-brand-500/40 hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected 
                              ? 'bg-brand-600 text-white' 
                              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                          }`}>
                            {optionLetter}
                          </div>
                          <span className="text-xs sm:text-sm font-medium flex-1">
                            {option}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-6 py-2 text-center animate-fade-in">
              <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                result?.passed 
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30' 
                  : 'bg-gradient-to-tr from-red-500 to-rose-400 text-white shadow-red-500/30'
              }`}>
                {result?.passed ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <XCircle className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result?.passed
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  {result?.passed ? "Muvaffaqiyatli O'tdingiz!" : "Imtihondan O'tolmadingiz"}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {result?.passed 
                    ? (lessonId ? "Tabriklaymiz! Darslik yakunlandi!" : `Tabriklaymiz! ${targetNextModule}-Modul ochildi!`)
                    : "Qayta urinib ko'rishingiz lozim"}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                  {result?.passed ? (
                    <>
                      Siz {result.totalQuestions} ta savoldan <strong>{result.correctCount} tasiga ({result.score}%)</strong> to'g'ri javob berdingiz. 
                      Darslik muvaffaqiyatli o'zlashtirildi!
                    </>
                  ) : (
                    <>
                      Siz {result?.totalQuestions} ta savoldan <strong>{result?.correctCount} tasiga ({result?.score}%)</strong> to'g'ri javob berdingiz. 
                      O'tish uchun kamida <strong>70%</strong> to'plashingiz kerak. Mavzuni takrorlab, qayta urinib ko'ring.
                    </>
                  )}
                </p>
              </div>

              {/* Stats Box */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 max-w-sm mx-auto flex items-center justify-around text-xs">
                <div>
                  <p className="text-gray-400 text-[10px]">To'g'ri javoblar</p>
                  <p className="text-base font-black text-emerald-500">{result?.correctCount} / {result?.totalQuestions}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                <div>
                  <p className="text-gray-400 text-[10px]">To'plangan ball</p>
                  <p className={`text-base font-black ${result?.passed ? 'text-brand-500' : 'text-red-500'}`}>
                    {result?.score}%
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                <div>
                  <p className="text-gray-400 text-[10px]">Kerakli ball</p>
                  <p className="text-base font-black text-gray-700 dark:text-gray-300">70%</p>
                </div>
              </div>

              {/* Answers Review Toggle (for non-backend or reviewable) */}
              {!lessonId && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowReview(!showReview)}
                    className="text-xs font-bold text-brand-500 hover:underline cursor-pointer"
                  >
                    {showReview ? "Javoblar tekshiruvini yashirish" : "Savollar va to'g'ri javoblarni ko'rish"}
                  </button>
                </div>
              )}

              {showReview && !lessonId && (
                <div className="space-y-3 text-left pt-2 border-t border-gray-100 dark:border-white/5 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const userAns = answers[idx];
                    const isCorrect = userAns === q.correctOption;
                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border text-xs ${
                          isCorrect
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">Savol #{idx + 1}</span>
                          <span className="font-bold">{isCorrect ? '✅ To\'g\'ri' : '❌ Noto\'g\'ri'}</span>
                        </div>
                        <p className="font-medium mb-1.5 text-gray-900 dark:text-white">{q.question}</p>
                        <p className="text-[11px] text-gray-600 dark:text-gray-400">
                          Sizning javobingiz: <span className="font-semibold">{userAns !== undefined ? q.options[userAns] : 'Belgilanmagan'}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            To'g'ri javob: {q.options[q.correctOption]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/70 dark:bg-white/[0.02] flex items-center justify-between">
          {!submitted ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0 || loadingQuiz}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                  currentIndex === 0 || loadingQuiz
                    ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-white/5 text-gray-400'
                    : 'border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Oldingi</span>
              </button>

              <div className="flex items-center space-x-2">
                {currentIndex === questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={submittingQuiz || loadingQuiz}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    {submittingQuiz ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Tekshirilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Testni Yakunlash ({answeredCount}/{questions.length})</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loadingQuiz}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Keyingi Savol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              {result?.passed ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Yopish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onSuccess) onSuccess({ lessonId, moduleIndex, score: result.score, passed: true });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{lessonId ? "Keyingi Darsga O'tish" : `${targetNextModule}-Modulga O'tish`}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Darslarga qaytish
                  </button>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Qayta topshirish</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
