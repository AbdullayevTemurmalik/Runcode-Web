import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Unlock, 
  Lock, 
  Users 
} from 'lucide-react';
import { renderTechLogo } from '../TechLogos';

export const HomeCoursesSection = ({ 
  courses, 
  isAuthenticated, 
  hasSubscription, 
  onCourseClick 
}) => {
  return (
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
              onClick={(e) => onCourseClick(e, c)}
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
  );
};
