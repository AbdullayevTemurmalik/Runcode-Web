import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, CreditCard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileBottomBar = () => {
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Bosh sahifa', path: '/', icon: Home },
    { label: 'Kurslar', path: '/courses', icon: BookOpen },
    { label: 'Tariflar', path: '/tariffs', icon: CreditCard },
    { 
      label: isAuthenticated ? 'Kabinet' : 'Kirish', 
      path: isAuthenticated ? '/dashboard' : '/login', 
      icon: User 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-white/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.15)] safe-area-pb">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-brand-500/15 scale-110 shadow-sm' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight leading-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand-500 absolute -bottom-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
