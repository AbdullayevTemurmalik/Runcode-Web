import React from 'react';
import { renderTechLogo } from '../TechLogos';

export const HomeTechStack = ({ techStack }) => {
  return (
    <div className="container-custom mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
        O'rganiladigan 8 ta asosiy zamonaviy texnologiya:
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 items-center justify-center">
        {techStack.map((tech) => (
          <div 
            key={tech.slug}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 dark:bg-[#0c0d12]/80 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {renderTechLogo(tech.slug, "w-7 h-7")}
            </div>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 mt-2">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
