import React from 'react';
import { 
  BookOpen, 
  List, 
  ChevronDown, 
  Lock, 
  CheckCircle2, 
  Play 
} from 'lucide-react';

export const CourseModulesAccordion = ({
  description,
  techTags = [],
  modules = [],
  expandedModules = {},
  toggleModule,
  handleLessonClick,
  user,
  isUpcoming,
  isPremium,
  canAccess
}) => {
  return (
    <div className="space-y-8">
      {/* Kurs haqida Blok */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0d12]/90 border border-gray-200 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Kurs haqida
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* O'rganiladigan texnologiyalar */}
        {techTags.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              O'rganiladigan texnologiyalar
            </p>
            <div className="flex flex-wrap gap-2">
              {techTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
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
            const isLocked = !mod.isUnlocked && user?.role !== 'admin' && !isUpcoming;

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

                {/* Modul Darslari */}
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
  );
};
