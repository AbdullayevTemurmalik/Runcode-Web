import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Send, 
  Terminal, 
  Layers 
} from 'lucide-react';

export const HomeHero = ({ isAuthenticated }) => {
  return (
    <section className="relative pt-10 sm:pt-16 pb-8 overflow-hidden">
      <div className="container-custom relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Platforma 2.0 ishga tushdi</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-500 ml-1" />
            </div>

            <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.08]">
              RunCode <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-400 to-teal-400">
                Dasturlash Kurslari
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              Nol darajadan professionalgacha ko'tariling. Zamonaviy texnologiyalar bilan amaliy kod yozing, o'rganing va portfolio uchun kuchli loyihalar yarating.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={isAuthenticated ? "/courses" : "/login"}
                state={isAuthenticated ? undefined : { message: "Kurslarni ko'rish va o'qish uchun avval tizimga kiring." }}
                className="px-7 py-3.5 rounded-full bg-white text-gray-950 hover:bg-gray-100 font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://t.me/TM_Backdev"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full border border-gray-300 dark:border-gray-800 bg-gray-100/80 dark:bg-gray-900/80 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-sky-500" />
                <span>@TM_Backdev</span>
              </a>
            </div>

            {/* Real Metrics: 100+ O'quvchilar, 5+ Loyihalar, 8 ta Texnologiyalar */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-gray-200/60 dark:border-gray-800/60 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">100+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-brand-500" /> O'quvchilar
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">5+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-brand-500" /> Loyihalar
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">8 ta</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1 text-brand-500" /> Texnologiyalar
                </p>
              </div>
            </div>

          </div>

          {/* Right: Modern Terminal Window (Mockup) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#0c101b] border border-gray-800/80 shadow-2xl p-5 sm:p-6 text-left font-mono text-xs sm:text-sm space-y-4 relative overflow-hidden group">
              
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 text-gray-500 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-gray-400 flex items-center">
                  <Terminal className="w-3.5 h-3.5 mr-1 text-gray-500" /> runcode-platform ~ bash
                </span>
              </div>

              {/* Terminal Commands */}
              <div className="space-y-2 text-gray-300">
                <p className="text-gray-400">
                  <span className="text-emerald-400 font-bold">$</span> runcode start --interactive
                </p>
                <p className="text-emerald-400 font-semibold text-xs">
                  ✓ Amaliy muhit muvaffaqiyatli ishga tushdi (HTML, CSS, JS, React)
                </p>
                <p className="text-gray-400 text-xs">
                  <span className="text-emerald-400 font-bold">$</span> runcode test --status
                </p>
                <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800/80 text-[11px] text-gray-300 space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Test natijasi:</span>
                    <span className="text-emerald-400 font-bold">100% muvaffaqiyatli</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Mentorlik guruhi:</span>
                    <span className="text-sky-400 font-bold">VIP Faol</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Sertifikat:</span>
                    <span className="text-amber-400 font-bold">QR-kodli / Rasmiy</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 animate-pulse">
                  &gt; Yangi darsga tayyormisiz? Kod yozishni boshlang...
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
