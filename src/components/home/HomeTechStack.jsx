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
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#0c0d12]/60 border border-gray-200/60 dark:border-white/5 hover:border-brand-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group cursor-pointer"
          >
            <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              {renderTechLogo(tech.slug, "w-7 h-7")}
            </div>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 mt-2">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
