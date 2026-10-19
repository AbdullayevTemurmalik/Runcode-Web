import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

const MONTHS_UZ = [
  { num: 1, name: 'Yanvar', short: 'Yan' },
  { num: 2, name: 'Fevral', short: 'Fev' },
  { num: 3, name: 'Mart', short: 'Mar' },
  { num: 4, name: 'Aprel', short: 'Apr' },
  { num: 5, name: 'May', short: 'May' },
  { num: 6, name: 'Iyun', short: 'Iyn' },
  { num: 7, name: 'Iyul', short: 'Iyl' },
  { num: 8, name: 'Avgust', short: 'Avg' },
  { num: 9, name: 'Sentabr', short: 'Sen' },
  { num: 10, name: 'Oktabr', short: 'Okt' },
  { num: 11, name: 'Noyabr', short: 'Noy' },
  { num: 12, name: 'Dekabr', short: 'Dek' }
];

const WEEKDAYS_UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export const CustomDatePicker = ({
  value = '', // Format: 'YYYY-MM-DD'
  onChange,
  label = "Tug'ilgan sana:",
  sublabel = "Kun • Oy • Yil",
  error = null,
  disabled = false,
  required = false,
  className = ''
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const yearsContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'

  const currentYear = new Date().getFullYear();
  const maxAllowedYear = currentYear - 7; // Kamida 7 yosh
  const minAllowedYear = 1940;

  // Selected date parsed
  const selectedDate = useMemo(() => {
    if (!value || typeof value !== 'string') return null;
    const clean = value.split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (y && m && d) return { year: y, month: m, day: d };
    }
    return null;
  }, [value]);

  // Calendar view navigation state
  const [viewYear, setViewYear] = useState(() => {
    if (selectedDate) return selectedDate.year;
    return 2002; // Foydalanuvchilar uchun qulay standart yil
  });

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return selectedDate.month;
    return 1;
  });

  // Display text in input field
  const [inputText, setInputText] = useState(() => {
    if (selectedDate) {
      const d = String(selectedDate.day).padStart(2, '0');
      const m = String(selectedDate.month).padStart(2, '0');
      const y = String(selectedDate.year);
      return `${d}.${m}.${y}`;
    }
    return '';
  });

  // Sync input text when value prop changes externally
  useEffect(() => {
    if (selectedDate) {
      const d = String(selectedDate.day).padStart(2, '0');
      const m = String(selectedDate.month).padStart(2, '0');
      const y = String(selectedDate.year);
      setInputText(`${d}.${m}.${y}`);
      setViewYear(selectedDate.year);
      setViewMonth(selectedDate.month);
    } else {
      setInputText('');
    }
  }, [selectedDate]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to selected year when switching to 'years' view
  useEffect(() => {
    if (viewMode === 'years' && yearsContainerRef.current) {
      const el = yearsContainerRef.current.querySelector(`[data-year="${viewYear}"]`);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [viewMode, viewYear]);

  // Age and Human readable label
  const { readableDate, ageText } = useMemo(() => {
    if (!selectedDate) return { readableDate: null, ageText: null };
    const mObj = MONTHS_UZ.find(m => m.num === selectedDate.month);
    const mName = mObj ? mObj.name : selectedDate.month;
    const formatted = `${selectedDate.day}-${mName}, ${selectedDate.year}`;

    // Age calculation
    const today = new Date();
    let age = today.getFullYear() - selectedDate.year;
    const mDiff = (today.getMonth() + 1) - selectedDate.month;
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < selectedDate.day)) {
      age--;
    }
    const ageString = age >= 0 ? `${age} yosh` : null;

    return { readableDate: formatted, ageText: ageString };
  }, [selectedDate]);

  // Handle direct typing in the input with auto-dot mask
  const handleInputChange = (e) => {
    if (disabled) return;
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 8);

    let formatted = '';
    if (digitsOnly.length > 0) {
      formatted += digitsOnly.slice(0, 2);
    }
    if (digitsOnly.length > 2) {
      formatted += '.' + digitsOnly.slice(2, 4);
    }
    if (digitsOnly.length > 4) {
      formatted += '.' + digitsOnly.slice(4, 8);
    }

    setInputText(formatted);

    if (digitsOnly.length === 8) {
      const d = parseInt(digitsOnly.slice(0, 2), 10);
      const m = parseInt(digitsOnly.slice(2, 4), 10);
      const y = parseInt(digitsOnly.slice(4, 8), 10);

      if (m >= 1 && m <= 12 && y >= minAllowedYear && y <= maxAllowedYear) {
        const daysInSelected = new Date(y, m, 0).getDate();
        if (d >= 1 && d <= daysInSelected) {
          const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          onChange?.(iso);
          setViewYear(y);
          setViewMonth(m);
          setIsOpen(false);
          return;
        }
      }
    } else if (digitsOnly.length === 0) {
      onChange?.('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputText('');
    onChange?.('');
    setViewMode('days');
  };

  // Calendar math
  const daysInCurrentMonth = useMemo(() => {
    return new Date(viewYear, viewMonth, 0).getDate();
  }, [viewYear, viewMonth]);

  const startDayOffset = useMemo(() => {
    // 0 = Yakshanba, 1 = Dushanba, ... 6 = Shanba
    const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
    // Dushanbani 0 qilish (Du=0, Se=1, Ch=2, Pa=3, Ju=4, Sh=5, Ya=6)
    return (firstDay + 6) % 7;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const iso = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange?.(iso);
    setIsOpen(false);
    setViewMode('days');
  };

  const handleSelectMonth = (monthNum) => {
    setViewMonth(monthNum);
    setViewMode('days');
  };

  const handleSelectYear = (yearNum) => {
    setViewYear(yearNum);
    setViewMode('months');
  };

  // Years list
  const yearsList = useMemo(() => {
    const list = [];
    for (let y = maxAllowedYear; y >= minAllowedYear; y--) {
      list.push(y);
    }
    return list;
  }, [maxAllowedYear, minAllowedYear]);

  // Current month metadata
  const currentMonthObj = MONTHS_UZ.find(m => m.num === viewMonth) || MONTHS_UZ[0];

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${className}`}>
      {/* 1. Label and Sublabel */}
      {(label || sublabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Calendar className="w-3.5 h-3.5 text-brand-500 mr-1.5 flex-shrink-0" />
              <span>{label}</span>
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}

          <div className="flex items-center space-x-2 text-[10px] font-medium">
            {ageText && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20">
                {ageText}
              </span>
            )}
            {readableDate ? (
              <span className="text-brand-500 font-bold flex items-center truncate">
                <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{readableDate}</span>
              </span>
            ) : (
              sublabel && <span className="text-gray-400">{sublabel}</span>
            )}
          </div>
        </div>
      )}

      {/* 2. Unified Custom Input Field */}
      <div
        onClick={() => {
          if (!disabled) setIsOpen(true);
        }}
        className={`relative flex items-center transition-all duration-200 rounded-xl border cursor-pointer ${
          error
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/10'
            : isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 bg-white dark:bg-[#0c0d12]'
            : 'border-gray-200 dark:border-white/10 hover:border-brand-500/40 bg-white dark:bg-[#0c0d12]/90'
        } ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-white/5'
            : ''
        }`}
      >
        {/* Left Calendar Icon */}
        <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-brand-500">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Masked Input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          disabled={disabled}
          placeholder="KK.OO.YYYY (Masalan: 15.05.2002)"
          className="w-full py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-mono text-xs sm:text-sm focus:outline-none cursor-pointer"
        />

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-1 pr-3">
          {inputText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Tozalash"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) setIsOpen(prev => !prev);
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors cursor-pointer"
            title="Taqvimni ochish"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Custom Calendar Dropdown Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-auto sm:w-[320px] top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#101422] border border-gray-200 dark:border-white/10 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header Navigation Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-white/[0.08]">
            {viewMode === 'days' ? (
              <>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                  title="Oldingi oy"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('months')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition-colors cursor-pointer"
                  >
                    {currentMonthObj.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('years')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition-colors cursor-pointer flex items-center"
                  >
                    <span>{viewYear}</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                  title="Keyingi oy"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : viewMode === 'months' ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Oyni tanlang ({viewYear}-yil)
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('days')}
                  className="text-[11px] font-semibold text-brand-500 hover:underline cursor-pointer"
                >
                  Ortga
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Tug'ilgan yilni tanlang
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('days')}
                  className="text-[11px] font-semibold text-brand-500 hover:underline cursor-pointer"
                >
                  Ortga
                </button>
              </div>
            )}
          </div>

          {/* VIEW MODE 1: DAYS (Taqvim paneli) */}
          {viewMode === 'days' && (
            <div className="space-y-2">
              {/* Hafta kunlari sarlavhasi */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS_UZ.map((w, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-black uppercase tracking-wider py-1 ${
                      idx >= 5 ? 'text-rose-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* Kunlar katakchalari */}
              <div className="grid grid-cols-7 gap-1">
                {/* Boshidagi bo'sh kataklar */}
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`blank-${idx}`} className="h-8 w-8" />
                ))}

                {/* Oy kunlari */}
                {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const isSelected =
                    selectedDate &&
                    selectedDate.year === viewYear &&
                    selectedDate.month === viewMonth &&
                    selectedDate.day === day;

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 w-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-brand-600 text-white font-black shadow-md shadow-brand-500/30 scale-105'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: MONTHS (Oylar ro'yxati) */}
          {viewMode === 'months' && (
            <div className="grid grid-cols-3 gap-2 py-1">
              {MONTHS_UZ.map((m) => {
                const isCurrentMonth = viewMonth === m.num;
                return (
                  <button
                    key={m.num}
                    type="button"
                    onClick={() => handleSelectMonth(m.num)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                      isCurrentMonth
                        ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/25'
                        : 'bg-gray-50 dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400'
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 3: YEARS (Yillar ro'yxati) */}
          {viewMode === 'years' && (
            <div
              ref={yearsContainerRef}
              className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 py-1 custom-scrollbar"
            >
              {yearsList.map((y) => {
                const isCurrentYear = viewYear === y;
                return (
                  <button
                    key={y}
                    data-year={y}
                    type="button"
                    onClick={() => handleSelectYear(y)}
                    className={`py-2 px-1 rounded-xl text-xs font-mono font-semibold text-center transition-all cursor-pointer ${
                      isCurrentYear
                        ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/25'
                        : 'bg-gray-50 dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-white/[0.08] text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-rose-500 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Tozalash
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setViewMode('days');
              }}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 text-[11px] font-bold transition-colors cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* 4. Error message display */}
      {error && (
        <div className="flex items-center space-x-1.5 text-rose-500 text-[11px] font-medium pt-0.5 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
