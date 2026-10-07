import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Send, Instagram, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800/80 bg-white dark:bg-[#080c14] transition-colors mt-20">
      <div className="container-custom py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                  RunCode<span className="text-brand-500">.uz</span>
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-wider uppercase mt-1">
                  By Temurmalik
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              O'zbekistonda zamonaviy web dasturlash ta'limi platformasi. HTML, CSS, JavaScript, React darsliklari, amaliy topshiriqlar hamda middle dasturchilarning professional yordami.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com/AbdullayevTemurmalik"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/temur.s1"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/TM_Backdev"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Kurslarimiz
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/courses" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">HTML Asoslari (Bepul)</Link>
              </li>
              <li>
                <Link to="/courses" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">CSS & Zamonaviy Dizayn</Link>
              </li>
              <li>
                <Link to="/courses" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">JavaScript Chuqur Kurs</Link>
              </li>
              <li>
                <Link to="/courses" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">React.js Ekotizimi</Link>
              </li>
              <li>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Tez Kunda: Node & Next.js</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Platforma
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/tariffs" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">Obuna va Tariflar</Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hover:text-brand-500 transition-colors">Shaxsiy Kabinet</Link>
              </li>
              <li className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-brand-500 mr-1.5 flex-shrink-0" />
                24/7 Xavfsiz To'lovlar
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} RunCode.uz By Temurmalik. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Temurmalik tomonidan dasturchilar uchun mehr bilan yaratilgan.
          </p>
        </div>
      </div>
    </footer>
  );
};
