import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Users, Layers } from 'lucide-react';

export const CourseDetailHero = ({
  title,
  category,
  level,
  isUpcoming,
  duration,
  studentsCount,
  modulesCount
}) => {
  return (
    <div className="space-y-6">
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
            {title}
          </h1>

          {/* Nishonlar qatori */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
              {category}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
              {level}
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
              {duration}
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
              {studentsCount}
            </p>
          </div>

          <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />

          <div>
            <p className="text-[11px] text-gray-400 flex items-center space-x-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Modullar</span>
            </p>
            <p className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
              {modulesCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
