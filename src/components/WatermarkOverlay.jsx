import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export const WatermarkOverlay = ({ text }) => {
  const { user } = useAuth();
  const isExempt = Boolean(
    user?.role === 'admin' || 
    user?.username === 'temur' || 
    user?.username === 'temurmalik'
  );

  if (isExempt) return null;

  const watermarkText = useMemo(() => {
    if (text) return text;
    if (!user) return 'RunCode.uz • Himoyalangan ta\'lim';
    const identifier = user.username || user.email || 'O\'quvchi';
    const subInfo = user.phone || user.email || `ID: ${user.id}`;
    return `RunCode.uz • @${identifier} • ${subInfo}`;
  }, [text, user]);

  // Ekran bo'ylab takrorlanuvchi 48 ta nuqta
  const items = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[5] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 sm:gap-16 p-6 opacity-[0.045] dark:opacity-[0.07] transition-opacity"
    >
      {items.map((i) => (
        <div
          key={i}
          className="flex items-center justify-center transform -rotate-[22deg] whitespace-nowrap text-xs sm:text-sm font-mono font-bold tracking-wider text-gray-900 dark:text-white"
        >
          {watermarkText}
        </div>
      ))}
    </div>
  );
};
