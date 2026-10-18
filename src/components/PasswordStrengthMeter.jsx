import React, { useMemo } from 'react';
import { CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';

export const evaluatePassword = (password = '') => {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: 'text-gray-400',
      barColor: 'bg-gray-300 dark:bg-white/10',
      badgeBg: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10',
      percent: 0,
      hasMinLength: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSpecial: false,
      isValid: false
    };
  }

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Mandatory requirements: min 8 characters, at least 1 uppercase, at least 1 number
  const isValid = hasMinLength && hasUpper && hasNumber;

  let points = 0;
  if (hasMinLength) points += 1;
  if (hasUpper) points += 1;
  if (hasNumber) points += 1;
  if (hasLower) points += 0.5;
  if (hasSpecial) points += 1;
  if (password.length >= 12) points += 0.5;

  if (points <= 2) {
    return {
      score: 1,
      label: 'Oddiy',
      color: 'text-rose-500',
      barColor: 'bg-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      percent: 25,
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid
    };
  }

  if (points < 3.5) {
    return {
      score: 2,
      label: "O'rta",
      color: 'text-amber-500',
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      percent: 50,
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid
    };
  }

  if (points < 4.5 || !hasSpecial) {
    return {
      score: 3,
      label: 'Kuchli',
      color: 'text-blue-500',
      barColor: 'bg-blue-500',
      badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      percent: 80,
      hasMinLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid
    };
  }

  return {
    score: 4,
    label: 'Mukammal',
    color: 'text-emerald-500',
    barColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    percent: 100,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid
  };
};

export const PasswordStrengthMeter = ({ password = '', showRequirements = true }) => {
  const strength = useMemo(() => evaluatePassword(password), [password]);

  if (!password) return null;

  return (
    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-2.5 text-xs transition-all animate-in fade-in">
      {/* Progress Bar & Label */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {strength.isValid ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            )}
            Parol xavfsizligi:
          </span>
          <span className={strength.color}>{strength.label}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.barColor}`}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
          <RequirementItem satisfied={strength.hasMinLength} text="Kamida 8 ta belgi" />
          <RequirementItem satisfied={strength.hasUpper} text="Katta harf (A-Z)" />
          <RequirementItem satisfied={strength.hasNumber} text="Raqam (0-9)" />
          <RequirementItem satisfied={strength.hasSpecial} text="Maxsus belgi (ixtiyoriy)" isOptional={true} />
        </div>
      )}
    </div>
  );
};

const RequirementItem = ({ satisfied, text, isOptional = false }) => (
  <div
    className={`flex items-center space-x-1.5 font-medium transition-colors ${
      satisfied 
        ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
        : isOptional
        ? 'text-gray-400 dark:text-gray-500'
        : 'text-gray-400 dark:text-gray-500'
    }`}
  >
    {satisfied ? (
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
    ) : (
      <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-white/20 inline-block flex-shrink-0" />
    )}
    <span>{text}</span>
  </div>
);
