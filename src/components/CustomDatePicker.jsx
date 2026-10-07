import React, { useMemo } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

const MONTHS = [
  { value: '01', label: '01 - Yanvar' },
  { value: '02', label: '02 - Fevral' },
  { value: '03', label: '03 - Mart' },
  { value: '04', label: '04 - Aprel' },
  { value: '05', label: '05 - May' },
  { value: '06', label: '06 - Iyun' },
  { value: '07', label: '07 - Iyul' },
  { value: '08', label: '08 - Avgust' },
  { value: '09', label: '09 - Sentabr' },
  { value: '10', label: '10 - Oktabr' },
  { value: '11', label: '11 - Noyabr' },
  { value: '12', label: '12 - Dekabr' }
];

export const CustomDatePicker = ({
  value = '', // Format: 'YYYY-MM-DD'
  onChange,
  label = "Tug'ilgan sana:",
  sublabel = "Kun • Oy • Yil",
  error,
  disabled = false,
  required = false
}) => {
  // Parse value 'YYYY-MM-DD' into components
  const { currentYear, currentMonth, currentDay } = useMemo(() => {
    if (!value || typeof value !== 'string') {
      return { currentYear: '', currentMonth: '', currentDay: '' };
    }
    const parts = value.split('T')[0].split('-');
    if (parts.length === 3) {
      return {
        currentYear: parts[0],
        currentMonth: parts[1].padStart(2, '0'),
        currentDay: parts[2].padStart(2, '0')
      };
    }
    return { currentYear: '', currentMonth: '', currentDay: '' };
  }, [value]);

  // Generate Year options (e.g. from currentYear - 7 down to 1950)
  const yearsOptions = useMemo(() => {
    const maxYear = new Date().getFullYear() - 7;
    const minYear = 1950;
    const list = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push({ value: String(y), label: `${y}-yil` });
    }
    return list;
  }, []);

  // Calculate days in selected month & year
  const daysOptions = useMemo(() => {
    let maxDays = 31;
    if (currentMonth) {
      const monthNum = parseInt(currentMonth, 10);
      if ([4, 6, 9, 11].includes(monthNum)) {
        maxDays = 30;
      } else if (monthNum === 2) {
        const y = parseInt(currentYear, 10);
        const isLeap = y ? (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) : false;
        maxDays = isLeap ? 29 : 28;
      }
    }

    const list = [];
    for (let d = 1; d <= maxDays; d++) {
      const strVal = String(d).padStart(2, '0');
      list.push({ value: strVal, label: `${d}-kun` });
    }
    return list;
  }, [currentMonth, currentYear]);

  // Dispatch change when any part updates
  const handlePartChange = (type, newVal) => {
    if (disabled || !onChange) return;

    let y = currentYear;
    let m = currentMonth;
    let d = currentDay;

    if (type === 'year') y = newVal;
    if (type === 'month') m = newVal;
    if (type === 'day') d = newVal;

    if (y && m && d) {
      onChange(`${y}-${m}-${d}`);
    } else {
      // Partial update if allowed
      onChange(`${y || ''}-${m || ''}-${d || ''}`.replace(/^--$/, ''));
    }
  };

  // Human readable label
  const readableDate = useMemo(() => {
    if (currentYear && currentMonth && currentDay) {
      const mObj = MONTHS.find((m) => m.value === currentMonth);
      const mName = mObj ? mObj.label.split('-')[1]?.trim() : currentMonth;
      return `${parseInt(currentDay, 10)}-${mName}, ${currentYear}`;
    }
    return null;
  }, [currentYear, currentMonth, currentDay]);

  return (
    <div className="space-y-1.5">
      {/* Header Label */}
      {(label || sublabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Calendar className="w-3.5 h-3.5 text-brand-500 mr-1.5" />
              <span>{label}</span>
              {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          {sublabel && (
            <span className="text-[10px] text-gray-400 font-medium">
              {readableDate ? (
                <span className="text-brand-500 font-bold flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {readableDate}
                </span>
              ) : (
                sublabel
              )}
            </span>
          )}
        </div>
      )}

      {/* 3 Custom Selects: Kun, Oy, Yil */}
      <div className="grid grid-cols-3 gap-2">
        {/* 1. Kun */}
        <CustomSelect
          value={currentDay}
          onChange={(val) => handlePartChange('day', val)}
          options={daysOptions}
          placeholder="Kun"
          disabled={disabled}
          size="md"
        />

        {/* 2. Oy */}
        <CustomSelect
          value={currentMonth}
          onChange={(val) => handlePartChange('month', val)}
          options={MONTHS}
          placeholder="Oy"
          disabled={disabled}
          size="md"
        />

        {/* 3. Yil */}
        <CustomSelect
          value={currentYear}
          onChange={(val) => handlePartChange('year', val)}
          options={yearsOptions}
          placeholder="Yil"
          disabled={disabled}
          size="md"
        />
      </div>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};
